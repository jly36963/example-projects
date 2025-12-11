import { getDate } from "./jobs/get-date.js";

async function handler(event, context) {
  const { job, variables } = event;
  console.log({ job, variables });

  switch (job) {
    case "GET_DATE":
      const result = await getDate(event);
      return result;
    default:
      throw new Error(`Unknown job: ${event.job}`);
  }
}

export { handler };
