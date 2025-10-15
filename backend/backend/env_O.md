SECRET_KEY=django-insecure-$9*6s8$h@06@rak@$p*c_eaw6n5q22p#%bpg(_xx+!3cg^g+g+
DEBUG=True



DATABASE_NAME=notarius
DATABASE_USER=postgres
DATABASE_PASSWORD=root1
DATABASE_HOST=localhost
DATABASE_PORT=5432

DATABASE_URL=postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}

ALLOWED_HOSTS=localhost,127.0.0.1,notarius-korneenkova-production.up.railway.app

CSRF_TRUSTED_ORIGINS=https://notarius-korneenkova-production.up.railway.app,https://*.railway.app,https://*.up.railway.app,http://127.0.0.1:8000,http://localhost:8000



CORS_ALLOWED_ORIGINS=http://localhost:8000,http://localhost:5173
CORS_ALLOW_CREDENTIALS=True


CSRF_COOKIE_SECURE=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_HTTPONLY=False
SESSION_COOKIE_HTTPONLY=False
CSRF_COOKIE_SAMESITE=Lax
SESSION_COOKIE_SAMESITE=Lax
SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO,https


PHONENUMBER_DEFAULT_REGION=UA
