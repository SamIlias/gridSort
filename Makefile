install:
	npm install

test:
	npm test

http-server:
	npx http-server ./dist
	
bundle:
	npm run build

build-image:
	docker build -t grid-sort .

run: build-image
	docker run -d -p 8080:80 grid-sort

deploy: bundle build-image run

.PHONY: test
