from django.db import models

# Create your models here.

class Chat(models.Model):
    role = models.CharField(max_length=255)
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role} - {self.content}"