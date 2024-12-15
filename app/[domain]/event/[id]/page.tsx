import React from "react";
import { cookies } from "next/headers";

const getEvent = async (id: string) => {
  const response = await fetch(`http://localhost:3000/api/get-event?id=${id}`);
  const data = await response.json();
  return data;
};

export default async function page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const event = await getEvent(id);
  console.log("Fetched event:", event);

  if (!event.event || !event.event.name) {
    console.error("Event or event name is missing");
    return <div className="text-white text-2xl">Event not found</div>;
  }

  const cookieStore = await cookies();
  const visitId = cookieStore.get("visit_id")?.value;

  const trackCheckoutClick = async () => {
    console.log("Checkout button clicked for event:", event.event.name);
    await fetch(`http://localhost:3000/api/track-payment-click`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId: event.event._id, visitId: visitId }),
    });
  };

  const handlePay = async () => {
    await trackCheckoutClick();
    // Add server-side payment processing logic here
  };

  return (
    <div className="text-white text-2xl">
      {event.event.name}

      {/* <form method="POST" action="/api/pay" onSubmit={handlePay}> */}
        <button type="submit">Pay</button>
      {/* </form> */}
    </div>
  );
}
