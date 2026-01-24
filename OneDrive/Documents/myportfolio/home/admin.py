from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('home.urls')),
    path('Blogs/', include('Blogs.urls')),
    path('About/', include('About.urls')),
    path('Contact/', include('Contact.urls')),
    path('Projects/', include('Projects.urls')),

]
