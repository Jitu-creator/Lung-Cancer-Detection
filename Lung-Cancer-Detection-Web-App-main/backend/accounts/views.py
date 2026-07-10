from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.models import AuthToken
from rest_framework import status
from knox.auth import TokenAuthentication
from .serializers import LoginSerializer
from django.contrib.auth import authenticate
from .serializers import RegistrationSerializer
import os
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from knox.views import LoginView as KnoxLoginView
from rest_framework import permissions
from accounts.serializers import PatientSerializer, UserSerializer
from accounts.models import Patientdb, EmailVerification
from django.contrib.auth import logout
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.crypto import get_random_string




class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user_obj = User.objects.get(username=username)
            if not user_obj.is_active:
                return Response({
                    'error': 'Please verify your email before logging in. Check your inbox for the verification link.'
                }, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            pass

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return super().post(request, format=None)
        else:
            return Response({'error': 'Invalid username or password.'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutAPI(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)
        return Response({'success': 'Logged out successfully.'})



class RegistrationView(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False
            user.save()

            ver, _ = EmailVerification.objects.get_or_create(user=user)
            ver.token = get_random_string(64)
            ver.save()

            verify_link = f"{settings.FRONTEND_URL}/verify-email?token={ver.token}&user_id={user.id}"
            try:
                send_mail(
                    subject="Verify your email – Lung Cancer Detection",
                    message=(
                        f"Hi {user.username},\n\n"
                        f"Thank you for registering! Please verify your email by clicking the link below:\n\n"
                        f"{verify_link}\n\n"
                        f"This link expires after 24 hours.\n\n"
                        f"Best regards,\nLung Cancer Detection Team"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=False,
                )
            except Exception as e:
                pass

            return Response({
                'msg': 'Registration successful. Please check your email to verify your account.',
                'user_info': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def get_user_data(request):
    user = request.user
    
    if user.is_authenticated:
        return Response({
            'user_info':{
                'id':user.id,
                'username':user.username,
                'email':user.email,
                'is_staff':user.is_staff
            },
        })
        
    return Response({'error':'not authenticated'}, status=400)

class PatientView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        serializer = PatientSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'Patient data Uploaded Successfully',
            'status':'success','candidate':serializer.data},
            status = status.HTTP_201_CREATED)
        return Response(serializer.errors)


@api_view(['GET'])
def list_patients(request):
    if request.user.is_authenticated and not request.user.is_staff:
        candidates = Patientdb.objects.filter(user=request.user)
    else:
        candidates = Patientdb.objects.all()
    serializer = PatientSerializer(
        candidates,
        many=True,
        context={'request': request}
    )
    return Response({'status':'success','candidates':serializer.data}, status=status.HTTP_200_OK)
    





# Patient details 
@api_view(['GET'])
def get_patient_details(request):
    name = request.GET.get('name')

    if not name:
        return Response({'error': 'Please provide a name to search for.'}, status=400)
    
    if request.user.is_staff:
        patients = Patientdb.objects.filter(name__icontains=name)
    else:
        patients = Patientdb.objects.filter(name__icontains=name, user=request.user)

    if not patients:
        return Response({'error': 'Patient not found.'}, status=404)

    serializer = PatientSerializer(patients, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def get_single_patient(request):

    patient_id = request.GET.get('id')

    if not patient_id:

        return Response(
            {'error': 'Patient ID required'},
            status=400
        )

    try:

        if request.user.is_staff:
            patient = Patientdb.objects.get(id=patient_id)
        else:
            patient = Patientdb.objects.get(id=patient_id, user=request.user)

        serializer = PatientSerializer(
            patient,
            context={'request': request}
        )

        return Response({
            'data': serializer.data
        })

    except Patientdb.DoesNotExist:

        return Response(
            {'error': 'Patient not found'},
            status=404
        )


# Login details 
@api_view(['GET'])
def getUserDetails(request):
    username = request.GET.get('username')

    if not username:
        return JsonResponse({'error': 'Username parameter required.'}, status=400)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found.'}, status=404)

    response = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    }

    return JsonResponse(response)




@api_view(['GET'])
def edit_patient_details(request):
    id = request.GET.get('id')

    if not id:
        return Response({'error': 'Please provide a name to search for.'}, status=400)
    
    if request.user.is_staff:
        patients = Patientdb.objects.filter(id=id)
    else:
        patients = Patientdb.objects.filter(id=id, user=request.user)

    if not patients:
        return Response({'error': 'Patient not found.'}, status=404)

    serializer = PatientSerializer(patients, many=True, context={'request': request})
    return Response(serializer.data)


#Delete patient details
@api_view(['DELETE'])
def delete_patient(request, id):

    try:

        if request.user.is_staff:
            patient = Patientdb.objects.get(id=id)
        else:
            patient = Patientdb.objects.get(id=id, user=request.user)

        patient.delete()

        return Response(
            {'message': 'Patient deleted successfully'}
        )

    except Patientdb.DoesNotExist:

        return Response(
            {'error': 'Patient not found'},
            status=404
        )


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_list_users(request):
    users = User.objects.all().order_by('-date_joined')
    serializer = UserSerializer(users, many=True)
    return Response({'users': serializer.data})


@api_view(['PUT'])
@permission_classes([permissions.IsAdminUser])
def admin_update_user(request, id):
    try:
        user = User.objects.get(id=id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'user': serializer.data, 'msg': 'User updated successfully'})
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([permissions.IsAdminUser])
def admin_delete_user(request, id):
    try:
        user = User.objects.get(id=id)
        user.delete()
        return Response({'msg': 'User deleted successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['POST'])
@permission_classes([AllowAny])
def bootstrap_admin(request):
    key = request.data.get('key', '')
    username = request.data.get('username', '')

    expected = os.environ.get('ADMIN_BOOTSTRAP_KEY', '')
    if not expected:
        return Response({'error': 'ADMIN_BOOTSTRAP_KEY not set on server.'}, status=500)
    if key != expected:
        return Response({'error': 'Invalid bootstrap key.'}, status=403)

    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)

    user.is_active = True
    user.is_staff = True
    user.is_superuser = True
    user.save()

    EmailVerification.objects.filter(user=user).delete()

    return Response({'msg': f'User "{username}" is now an active admin.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    token = request.data.get('token')
    user_id = request.data.get('user_id')

    if not token or user_id is None:
        return Response({'error': 'Token and user_id are required.'}, status=400)

    try:
        ver = EmailVerification.objects.get(user_id=user_id, token=token)
    except EmailVerification.DoesNotExist:
        return Response({'error': 'Invalid or expired verification link.'}, status=400)

    user = ver.user
    user.is_active = True
    user.save()
    ver.delete()

    return Response({'msg': 'Email verified successfully. You can now log in.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification(request):
    username = request.data.get('username')
    email = request.data.get('email')

    if not username or not email:
        return Response({'error': 'Username and email are required.'}, status=400)

    try:
        user = User.objects.get(username=username, email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=404)

    if user.is_active:
        return Response({'error': 'Account is already verified.'}, status=400)

    ver, _ = EmailVerification.objects.get_or_create(user=user)
    ver.token = get_random_string(64)
    ver.save()

    verify_link = f"{settings.FRONTEND_URL}/verify-email?token={ver.token}&user_id={user.id}"
    try:
        send_mail(
            subject="Verify your email – Lung Cancer Detection",
            message=(
                f"Hi {user.username},\n\n"
                f"Here is your new verification link:\n\n"
                f"{verify_link}\n\n"
                f"Best regards,\nLung Cancer Detection Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception:
        return Response({'error': 'Failed to send email. Check SMTP settings.'}, status=500)

    return Response({'msg': 'Verification email resent. Please check your inbox.'})
