import { format } from "date-fns";

async function getDate(event) {
  // Pretend to do something async
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const date = format(new Date(), "yyyy-MM-dd");
  return {
    data: { date },
    messages: [],
    errors: [],
  };
}

export { getDate };
