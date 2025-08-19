from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.routes.content import router as content_router


def create_app() -> FastAPI:
    app = FastAPI(title=settings.project_name)

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(o) for o in settings.backend_cors_origins] or ['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*'],
    )

    # Health
    @app.get('/health')
    def health() -> dict[str, str]:  # pragma: no cover - trivial route
        return {"status": "ok"}

    # API routes
    app.include_router(content_router, prefix=settings.api_v1_str, tags=['content'])

    return app


app = create_app()


