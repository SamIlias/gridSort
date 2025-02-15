install:
	npm install

test:
	npm test

http-server:
	npx http-server ./dist
	
bundle:
	npm run build

build-image:
	docker build -t gridSort .

run: build-image
	docker run -d -p 8080:80 gridSort

deploy: bundle build-image run

.PHONY: test
