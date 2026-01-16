from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, person, family

app = FastAPI()

origins = ["http://localhost:5173","https://origin-family-tree.netlify.app/"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)

app.include_router(auth.router)
app.include_router(person.router)
app.include_router(family.router)

@app.get("/",methods=["GET", "HEAD"])
def root():
    return {"message": "API is running"}
