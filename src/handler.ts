import * as dotenv from 'dotenv'
import { Handler } from 'aws-lambda'
import { init } from './controllers/BotController'

export const reciveMessage: Handler = async (event:any) => {
  dotenv.config()

  const body = JSON.parse(event.body)

  await init(body)
  
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};

export const hello = async (event) => {
  
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "I'm on!",
        input: event,
      },
      null,
      2
    ),
  };
}
