from django.core.management.base import BaseCommand
from apps.authentication.models import User


class Command(BaseCommand):
    help = "Seeds initial demo users (Admin and Member) for local development and testing."

    def handle(self, *args, **options):
        # Create or update Admin
        admin_email = "admin@jarvis.local"
        if not User.objects.filter(email=admin_email).exists():
            admin = User.objects.create_superuser(
                email=admin_email,
                password="AdminPassword123!",
                first_name="Jarvis",
                last_name="Administrator",
                role="ADMIN",
            )
            self.stdout.write(self.style.SUCCESS(f"Created Admin: {admin_email} / AdminPassword123!"))
        else:
            self.stdout.write(f"Admin {admin_email} already exists.")

        # Create or update Demo Member
        member_email = "member@jarvis.local"
        if not User.objects.filter(email=member_email).exists():
            member = User.objects.create_user(
                email=member_email,
                password="MemberPassword123!",
                first_name="Demo",
                last_name="Subscriber",
                role="MEMBER",
            )
            self.stdout.write(self.style.SUCCESS(f"Created Member: {member_email} / MemberPassword123!"))
        else:
            self.stdout.write(f"Member {member_email} already exists.")
