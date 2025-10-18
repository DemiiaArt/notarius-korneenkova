from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.postgres.search import TrigramSimilarity

from main_page.models import ServiceCategory
from blog.models import BlogPost


class SearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        q = (request.GET.get('q') or '').strip()
        if not q:
            return Response({"results": []})

        lang = request.GET.get('lang', 'ua')
        if lang not in ['ua', 'ru', 'en']:
            lang = 'ua'
        search_type = request.GET.get('type', 'all')
        try:
            limit = int(request.GET.get('limit', 10))
        except Exception:
            limit = 10

        svc_title_field = {'ua': 'label_ua', 'ru': 'label_ru', 'en': 'label_en'}[lang]
        blog_title_field = {'ua': 'title_ua', 'ru': 'title_ru', 'en': 'title_en'}[lang]

        results = []

        if search_type in ['all', 'services']:
            svc_qs = (
                ServiceCategory.objects
                .annotate(similarity=TrigramSimilarity(svc_title_field, q))
                .filter(**{f"{svc_title_field}__icontains": q})
                .order_by('-similarity', 'order')
            )[:limit]
            for s in svc_qs:
                title = getattr(s, svc_title_field)
                results.append({
                    'type': 'service',
                    'id': s.id,
                    'title': title,
                    'url': s.get_canonical_url(lang),
                    'similarity': getattr(s, 'similarity', 0.0),
                })

        if search_type in ['all', 'blog']:
            blog_qs = (
                BlogPost.objects.published()
                .annotate(similarity=TrigramSimilarity(blog_title_field, q))
                .filter(**{f"{blog_title_field}__icontains": q})
                .order_by('-similarity', '-published_at', '-created_at')
            )[:limit]
            for p in blog_qs:
                title = getattr(p, blog_title_field)
                results.append({
                    'type': 'blog',
                    'id': p.id,
                    'title': title,
                    'url': p.get_canonical_url(lang),
                    'published_at': p.published_at,
                    'similarity': getattr(p, 'similarity', 0.0),
                })

        results.sort(key=lambda r: (r.get('similarity', 0.0), r.get('published_at') or 0), reverse=True)
        return Response({'results': results[:limit]})


class SearchSuggestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        q = (request.GET.get('q') or '').strip()
        if not q:
            return Response({"suggestions": []})

        lang = request.GET.get('lang', 'ua')
        if lang not in ['ua', 'ru', 'en']:
            lang = 'ua'
        search_type = request.GET.get('type', 'all')
        try:
            limit = int(request.GET.get('limit', 8))
        except Exception:
            limit = 8

        svc_title_field = {'ua': 'label_ua', 'ru': 'label_ru', 'en': 'label_en'}[lang]
        blog_title_field = {'ua': 'title_ua', 'ru': 'title_ru', 'en': 'title_en'}[lang]

        suggestions = []

        if search_type in ['all', 'services']:
            svc_qs = (
                ServiceCategory.objects
                .annotate(similarity=TrigramSimilarity(svc_title_field, q))
                .filter(**{f"{svc_title_field}__icontains": q})
                .order_by('-similarity', 'order')
            )[:limit]
            for s in svc_qs:
                suggestions.append({'type': 'service', 'title': getattr(s, svc_title_field), 'url': s.get_canonical_url(lang)})

        if search_type in ['all', 'blog']:
            blog_qs = (
                BlogPost.objects.published()
                .annotate(similarity=TrigramSimilarity(blog_title_field, q))
                .filter(**{f"{blog_title_field}__icontains": q})
                .order_by('-similarity', '-published_at', '-created_at')
            )[:limit]
            for p in blog_qs:
                suggestions.append({'type': 'blog', 'title': getattr(p, blog_title_field), 'url': p.get_canonical_url(lang)})

        seen = set()
        deduped = []
        for s in suggestions:
            key = (s['type'], s['title'])
            if key in seen:
                continue
            seen.add(key)
            deduped.append(s)

        return Response({'suggestions': deduped[:limit]})


