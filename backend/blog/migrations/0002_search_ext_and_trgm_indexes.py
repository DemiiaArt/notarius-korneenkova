from django.db import migrations


SQL_ENABLE_EXT = (
    "CREATE EXTENSION IF NOT EXISTS unaccent;",
    "CREATE EXTENSION IF NOT EXISTS pg_trgm;",
)


class Migration(migrations.Migration):
    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(sql=SQL_ENABLE_EXT[0], reverse_sql="DROP EXTENSION IF EXISTS unaccent;"),
        migrations.RunSQL(sql=SQL_ENABLE_EXT[1], reverse_sql="DROP EXTENSION IF EXISTS pg_trgm;"),
        migrations.RunSQL(
            sql=(
                "CREATE INDEX IF NOT EXISTS blogpost_title_ru_trgm_idx "
                "ON blog_blogpost USING GIN (title_ru gin_trgm_ops);"
            ),
            reverse_sql="DROP INDEX IF EXISTS blogpost_title_ru_trgm_idx;",
        ),
        migrations.RunSQL(
            sql=(
                "CREATE INDEX IF NOT EXISTS blogpost_title_ua_trgm_idx "
                "ON blog_blogpost USING GIN (title_ua gin_trgm_ops);"
            ),
            reverse_sql="DROP INDEX IF EXISTS blogpost_title_ua_trgm_idx;",
        ),
        migrations.RunSQL(
            sql=(
                "CREATE INDEX IF NOT EXISTS blogpost_title_en_trgm_idx "
                "ON blog_blogpost USING GIN (title_en gin_trgm_ops);"
            ),
            reverse_sql="DROP INDEX IF EXISTS blogpost_title_en_trgm_idx;",
        ),
    ]


