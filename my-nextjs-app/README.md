## Getting Started - Docker Steps 

# list of images
```bash
docker ps
```

# docker build
```bash
docker build -t my-nextjs-app .
```

# stop image
```bash
docker stop ashton152/go-app:latest
docker stop bhakthiprabhu/my-nextjs-app:latest
```

# docker run 
```bash 
docker run -d -p 9500:3000 bhakthiprabhu/my-nextjs-app:latest
docker run -d -p 9000:8080 ashton152/my-go-app:latest  
```

# docker pull
```bash
docker pull ashton152/my-go-app:latest    
docker pull bhakthiprabhu/my-nextjs-app:latest 
```

# docker compose
```bash
docker-compose build
docker-compose up -d
docker-compose down
docker-compose restart
docker-compose logs -f
```

------------------------------------------------------------------------

# Local Run 
```bash
docker pull ashton152/my-go-app:latest     
docker run -d -p 9000:9000 ashton152/my-go-app:latest    
npm run dev 
```

# Docker Deploy 
```bash
docker build -t my-nextjs-app .
docker run -p 3000:3000 my-nextjs-app
```

# Push to Docker Hub
```bash
docker login 
docker tag my-nextjs-app bhakthiprabhu/my-nextjs-app:latest
docker push bhakthiprabhu/my-nextjs-app:latest
```

# Docker Run
```bash
docker pull ashton152/my-go-app:latest
docker pull bhakthiprabhu/my-nextjs-app:latest  
docker-compose down
docker-compose build
docker-compose up -d
```