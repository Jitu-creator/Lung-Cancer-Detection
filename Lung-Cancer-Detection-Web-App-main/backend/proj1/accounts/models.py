



from django.db import models
from django.core.files.base import ContentFile

import os
import logging
from io import BytesIO
from threading import Lock

import cv2
import numpy as np
import tensorflow as tf
from PIL import Image

logger = logging.getLogger(__name__)

_LUNG_MODEL = None
_MODEL_LOCK = Lock()


class Patientdb(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    dob = models.DateField()
    state = models.CharField(max_length=50)
    gender = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

    pimage = models.ImageField()

    classified = models.CharField(
        max_length=200,
        blank=True
    )

    heatmap_image = models.ImageField(
        upload_to='heatmaps/',
        blank=True,
        null=True
    )

    confidence_score = models.FloatField(
        blank=True,
        null=True
    )

    uploaded = models.DateTimeField(
        auto_now_add=True
    )

    phone_number = models.CharField(
        max_length=100
    )

    CLASS_NAMES = [
        'Benign case',
        'Malignant case',
        'Normal case'
    ]

    @staticmethod
    def get_lung_model():
        global _LUNG_MODEL

        if _LUNG_MODEL is None:
            with _MODEL_LOCK:
                if _LUNG_MODEL is None:

                    from tensorflow.keras.models import load_model

                    model_path = os.path.join(
                        os.path.dirname(
                            os.path.abspath(__file__)
                        ),
                        'best_model (1).h5'
                    )

                    logger.info(
                        "Loading lung model from %s",
                        model_path
                    )

                    _LUNG_MODEL = load_model(model_path)

        return _LUNG_MODEL

    @staticmethod
    def get_last_conv_layer(model):
        """
        Automatically find last Conv2D layer.
        """

        for layer in reversed(model.layers):

            if isinstance(layer, tf.keras.layers.Conv2D):
                return layer.name

        raise ValueError(
            "No Conv2D layer found in model."
        )

    def classify_image(self):

        model = self.get_lung_model()

        # Open image safely
        self.pimage.open()

        img = Image.open(self.pimage).convert("RGB")

        img = img.resize((224, 224))

        img_array = np.array(img)

        img_array = img_array.astype(
            np.float32
        ) / 255.0

        img_array = np.expand_dims(
            img_array,
            axis=0
        )

        pred = model.predict(
            img_array,
            verbose=0
        )

        predicted_class = int(
            np.argmax(pred)
        )

        confidence = float(
            np.max(pred) * 100
        )

        label = self.CLASS_NAMES[
            predicted_class
        ]

        logger.info(
            "Prediction: %s (%.2f%%)",
            label,
            confidence
        )

        return (
            label,
            confidence,
            predicted_class
        )

    def generate_gradcam(self, class_idx):

        model = self.get_lung_model()

        last_conv_layer_name = (
            self.get_last_conv_layer(model)
        )

        logger.info(
            "Using GradCAM layer: %s",
            last_conv_layer_name
        )

        # Load image
        img = Image.open(
            self.pimage
        ).convert("RGB")

        img = img.resize(
            (224, 224)
        )

        img_array = np.array(
            img,
            dtype=np.float32
        )

        img_array = (
            img_array / 255.0
        )

        img_array = np.expand_dims(
            img_array,
            axis=0
        )

        grad_model = tf.keras.models.Model(
            inputs=model.inputs,
            outputs=[
                model.get_layer(
                    last_conv_layer_name
                ).output,
                model.output
            ]
        )

        with tf.GradientTape() as tape:

            conv_outputs, predictions = (
                grad_model(img_array)
            )

            loss = predictions[:, class_idx]

        grads = tape.gradient(
            loss,
            conv_outputs
        )

        pooled_grads = tf.reduce_mean(
            grads,
            axis=(0, 1, 2)
        )

        conv_outputs = conv_outputs[0]

        heatmap = (
            conv_outputs
            @ pooled_grads[..., tf.newaxis]
        )

        heatmap = tf.squeeze(
            heatmap
        )

        heatmap = np.maximum(
            heatmap,
            0
        )

        heatmap = heatmap / (
            np.max(heatmap) + 1e-8
        )

        heatmap = np.where(
            heatmap > 0.4,
            heatmap,
            0
        )

        original_img = cv2.cvtColor(
            np.array(img),
            cv2.COLOR_RGB2BGR
        )

        heatmap = cv2.resize(
            heatmap,
            (224, 224)
        )

        heatmap = np.uint8(
            255 * heatmap
        )

        heatmap = cv2.applyColorMap(
            heatmap,
            cv2.COLORMAP_JET
        )

        superimposed_img = (
            cv2.addWeighted(
                original_img,
                0.75,
                heatmap,
                0.45,
                0
            )
        )

        final_img = Image.fromarray(
            cv2.cvtColor(
                superimposed_img,
                cv2.COLOR_BGR2RGB
            )
        )

        buffer = BytesIO()

        final_img.save(
            buffer,
            format="PNG"
        )

        filename = (
            f"heatmap_{self.pk}.png"
        )

        self.heatmap_image.save(
            filename,
            ContentFile(
                buffer.getvalue()
            ),
            save=False
        )

    def save(self, *args, **kwargs):

        is_new = self.pk is None

        super().save(*args, **kwargs)

        # Skip if no image
        if not self.pimage:
            return

        # Already classified
        if self.classified:
            return

        try:

            (
                label,
                confidence,
                class_idx
            ) = self.classify_image()

            self.classified = label

            self.confidence_score = (
                confidence
            )

            self.generate_gradcam(
                class_idx
            )

            Patientdb.objects.filter(
                pk=self.pk
            ).update(
                classified=self.classified,
                confidence_score=self.confidence_score,
                heatmap_image=self.heatmap_image
            )

            logger.info(
                "Classification completed for patient %s",
                self.pk
            )

        except Exception:

            logger.exception(
                "Classification failed for patient %s",
                self.pk
            )

            Patientdb.objects.filter(
                pk=self.pk
            ).update(
                classified="Classification failed"
            )

















# from django.db import models
# import os
# import traceback

# import cv2
# import numpy as np
# import tensorflow as tf

# from django.core.files.base import ContentFile

# from io import BytesIO

# from PIL import Image

# _LUNG_MODEL = None



 
    
    
# class Patientdb(models.Model):
#     name = models.CharField(max_length=100)
#     email = models.EmailField()
#     dob = models.DateField(auto_now=False, auto_now_add=False)
#     state = models.CharField(max_length=50)
#     gender = models.CharField(max_length=100)
#     location = models.CharField(max_length=100)
#     pimage = models.ImageField()
#     classified = models.CharField(max_length=200,blank=True)

#     heatmap_image = models.ImageField(
#         upload_to='heatmaps/',
#         blank=True,
#         null=True
#     )

#     confidence_score = models.FloatField(
#         blank=True,
#         null=True
#     )

#     uploaded = models.DateTimeField(auto_now_add=True) 
#     phone_number = models.CharField(max_length=100)

#     @staticmethod
#     def get_lung_model():
#         global _LUNG_MODEL

#         if _LUNG_MODEL is not None:
#             return _LUNG_MODEL

#         from tensorflow.keras.models import load_model

#         model_path = os.path.join(
#             os.path.dirname(os.path.abspath(__file__)),
#             'best_model (1).h5'
#         )

#         _LUNG_MODEL = load_model(model_path)

#         return _LUNG_MODEL

#     def classify_image(self):

#         import cv2
#         import numpy as np

#         class_names = ['Benign case', 'Malignant case', 'Normal case']

#         model = self.get_lung_model()

#         # Read image
#         img_array = cv2.imread(self.pimage.path)

#         if img_array is None:
#             raise ValueError(f'Could not read image: {self.pimage.path}')

#         # Convert BGR → RGB
#         img_array = cv2.cvtColor(
#             img_array,
#             cv2.COLOR_BGR2RGB
#         )

#         # Resize
#         img_array = cv2.resize(
#             img_array,
#             (224, 224)
#         )

#         # Normalize EXACTLY like training
#         img_array = img_array.astype(np.float32) / 255.0

#         # Add batch dimension
#         img_array = np.expand_dims(
#             img_array,
#             axis=0
#         )

#         # Predict
#         pred = model.predict(img_array)

#         print("RAW PREDICTION:", pred)

#         predicted_class = np.argmax(pred)

#         confidence = float(np.max(pred) * 100)

#         result = (
#             f"{class_names[predicted_class]} "
#             f"({confidence:.2f}%)"
#         )

#         return result
    
#     def generate_gradcam(self):

#         class_names = [
#             'Benign case',
#             'Malignant case',
#             'Normal case'
#         ]

#         model = self.get_lung_model()

#         last_conv_layer_name = "conv5_block16_concat"

#         # Load image
#         img = tf.keras.preprocessing.image.load_img(
#             self.pimage.path,
#             target_size=(224,224)
#         )

#         img_array = tf.keras.preprocessing.image.img_to_array(img)

#         img_array = np.expand_dims(img_array, axis=0)

#         img_array = img_array / 255.0

#         # Create GradCAM model
#         grad_model = tf.keras.models.Model(
#             [model.inputs],
#             [
#                 model.get_layer(last_conv_layer_name).output,
#                 model.output
#             ]
#         )

#         # Gradient computation
#         with tf.GradientTape() as tape:

#             conv_outputs, predictions = grad_model(img_array)

#             predicted_class = tf.argmax(predictions[0])

#             loss = predictions[:, predicted_class]

#         grads = tape.gradient(loss, conv_outputs)

#         pooled_grads = tf.reduce_mean(
#             grads,
#             axis=(0,1,2)
#         )

#         conv_outputs = conv_outputs[0]

#         heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]

#         heatmap = tf.squeeze(heatmap)

#         # Normalize
#         heatmap = np.maximum(heatmap, 0)

#         heatmap = heatmap / (np.max(heatmap) + 1e-8)

#         heatmap = np.where(
#             heatmap > 0.4,
#             heatmap,
#             0
#         )

#         # Original image
#         original_img = cv2.imread(self.pimage.path)

#         original_img = cv2.resize(
#             original_img,
#             (224,224)
#         )

#         # Resize heatmap
#         heatmap = cv2.resize(
#             heatmap,
#             (224,224)
#         )

#         heatmap = np.uint8(255 * heatmap)

#         heatmap = cv2.applyColorMap(
#             heatmap,
#             cv2.COLORMAP_JET
#         )

#         # Overlay
#         superimposed_img = cv2.addWeighted(
#             original_img,
#             0.75,
#             heatmap,
#             0.45,
#             0
#         )

#         # Convert to image
#         image = Image.fromarray(
#             cv2.cvtColor(
#                 superimposed_img,
#                 cv2.COLOR_BGR2RGB
#             )
#         )

#         buffer = BytesIO()

#         image.save(buffer, format='PNG')

#         file_name = f'heatmap_{self.pk}.png'

#         self.heatmap_image.save(
#             file_name,
#             ContentFile(buffer.getvalue()),
#             save=False
#         )

#     def save(self,*args,**kwargs): # code pre trained model and  the whole classification take place
#         super().save(*args, **kwargs)

#         if not self.pimage or self.classified:
#             return

#         try:
#             self.classified = self.classify_image()

#             classification_result = self.classified.split("(")[0].strip()

#             # Extract confidence
#             confidence_text = self.classified.split("(")[-1]

#             confidence_text = confidence_text.replace("%)", "")

#             self.confidence_score = float(confidence_text)

#             # Generate GradCAM
#             self.generate_gradcam()

#             Patientdb.objects.filter(pk=self.pk).update(
#                 classified=classification_result,
#                 confidence_score=self.confidence_score,
#                 heatmap_image=self.heatmap_image
#             )

#         except Exception as e:
#             print('classification failed',e)
#             traceback.print_exc()
#             Patientdb.objects.filter(pk=self.pk).update(classified='Classification failed')


