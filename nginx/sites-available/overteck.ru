server {
	listen 443 ssl;
	server_name overteck.ru;

	ssl_certificate /etc/letsencrypt/live/overteck.ru/fullchain.pem; # managed by Certbot
	ssl_certificate_key /etc/letsencrypt/live/overteck.ru/privkey.pem; # managed by Certbot
	include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
	ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

	location / {
		proxy_pass http://client:3000;
	
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection $http_connection;
	}
}

server {
	listen 443 ssl;
	server_name api.overteck.ru;

	ssl_certificate /etc/letsencrypt/live/overteck.ru/fullchain.pem; # managed by Certbot
	ssl_certificate_key /etc/letsencrypt/live/overteck.ru/privkey.pem; # managed by Certbot
	include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
	ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

	location / {
		proxy_pass http://api:8080/;
	}
}
