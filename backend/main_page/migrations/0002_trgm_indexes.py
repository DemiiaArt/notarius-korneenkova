from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('main_page', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql=(
                "CREATE INDEX IF NOT EXISTS servicecategory_label_ru_trgm_idx "
                "ON main_page_servicecategory USING GIN (label_ru gin_trgm_ops);"
            ),
            reverse_sql="DROP INDEX IF EXISTS servicecategory_label_ru_trgm_idx;",
        ),
        migrations.RunSQL(
            sql=(
                "CREATE INDEX IF NOT EXISTS servicecategory_label_ua_trgm_idx "
                "ON main_page_servicecategory USING GIN (label_ua gin_trgm_ops);"
            ),
            reverse_sql="DROP INDEX IF EXISTS servicecategory_label_ua_trgm_idx;",
        ),
        migrations.RunSQL(
            sql=(
                "CREATE INDEX IF NOT EXISTS servicecategory_label_en_trgm_idx "
                "ON main_page_servicecategory USING GIN (label_en gin_trgm_ops);"
            ),
            reverse_sql="DROP INDEX IF EXISTS servicecategory_label_en_trgm_idx;",
        ),
    ]


