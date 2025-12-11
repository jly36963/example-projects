FROM public.ecr.aws/lambda/nodejs:20

COPY . ./
RUN npm i --production

CMD [ "index.handler" ]
