# bitrics_BE
[![deploy](https://github.com/hk-bitrics/bitrics_BE/actions/workflows/deploy.yml/badge.svg)](https://github.com/hk-bitrics/bitrics_BE/actions/workflows/deploy.yml)
## Install
> **nginx**
```
$ sudo apt-get update
$ sudo apt-get install nginx
```

Nginx 설정 파일 수정
```
sudo vi /etc/nginx/sites-available/bitrics.conf
sudo ln -s /etc/nginx/sites-available/bitrics.conf /etc/nginx/sites-enabled/bitrics.conf
```
```
server {
    listen 80;
    server_name {탄력적 IP};

    error_log /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;

    location / {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS 관련 헤더 설정
        add_header 'Access-Control-Allow-Origin' '{탄력적 IP}' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' '*' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
    }


}
```
```
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl restart nginx
```

<br/>
