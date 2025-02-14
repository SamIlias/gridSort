# use light weight image nginx
FROM nginx:alpine

# copy the project files to a folder maintained by nginx
COPY dist/ /usr/share/nginx/html/

# open port 80 to access the page 
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
