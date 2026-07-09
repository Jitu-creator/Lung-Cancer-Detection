from django.contrib.auth.models import User
from rest_framework import serializers,validators
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from accounts.models import Patientdb


class LoginSerializer(serializers.Serializer):
    # email = serializers.EmailField(max_length=255)
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255)



class RegistrationSerializer(serializers.ModelSerializer):
    

    class Meta:
        model = User
        #fields = ('username', 'password','email','first_name','last_name')
        fields = ('username', 'password','email')
        
        password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        username = validated_data.get('username')
        password = validated_data.get('password')
        email = validated_data.get('email')
        #first_name = validated_data.get('first_name')
        #last_name = validated_data.get('last_name')
        
        user = User.objects.create(
            username=username, 
            password=password,
            email= email,
            #first_name = first_name,
            #last_name = last_name
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
    
    


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


from knox.serializers import UserSerializer as KnoxUserSerializer

class KnoxUserSerializer(KnoxUserSerializer):
    class Meta(KnoxUserSerializer.Meta):
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined']


class PatientSerializer(serializers.ModelSerializer):
    heatmap_url = serializers.SerializerMethodField()
    user_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Patientdb
        fields =  ['id','name','email','dob','state','gender','location','pimage','classified','uploaded','phone_number', 'confidence_score', 'heatmap_url', 'user_id']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)
    
    
    def get_heatmap_url(self, obj):

        request = self.context.get('request')

        if obj.heatmap_image and request:

            return request.build_absolute_uri(
                obj.heatmap_image.url
            )

        return None

