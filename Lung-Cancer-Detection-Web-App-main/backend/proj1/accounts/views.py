from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.models import AuthToken
from rest_framework import status
# from .serializers import RegisterSerializer
from knox.auth import TokenAuthentication
from .serializers import LoginSerializer
from django.contrib.auth import authenticate
from .serializers import RegistrationSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login
from knox.views import LoginView as KnoxLoginView
from rest_framework import permissions
from accounts.serializers import PatientSerializer, UserSerializer
from accounts.models import Patientdb
from django.contrib.auth import logout
from django.http import JsonResponse
from django.contrib.auth.models import User




class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        username = request.data.get('username')
        password = request.data.get('password')
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
            _, token = AuthToken.objects.create(user)
            return Response({
                    'user_info':{
                    'id':user.id,
                    'username':user.username,
                    'email':user.email
                    },
                'token':token
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
