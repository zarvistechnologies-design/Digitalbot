from django.shortcuts import render

def index(request):
    return render(request, 'home/index.html')

def about(request):
    return render(request, 'home/About.html')

def blogs(request):
    return render(request, 'home/Blogs.html')

def contact(request):
    return render(request, 'home/Contact.html')

def projects(request):
    return render(request, 'home/Projects.html')



