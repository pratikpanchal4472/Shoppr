# Shoppr
Shopping cart example Application.

#### You should have docker installed to run this.
#### Make sure NodeJS is installed and is of 12.22.3 version.

Run UI using:
```buildoutcfg
   cd ui
   npm install
   ng serve
```

Run Postgres and Server using: 
```
docker-compose up -d
cd api
uvicorn app.main:app --port 8000
```

