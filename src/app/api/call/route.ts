import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

interface RequestBody {
  to: string;
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Validate critical environment variables
if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error(
    "Twilio credentials are not properly configured in environment variables"
  );
}

const client = twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { to } = body;

    // Validate phone number format (simple check)
    if (!to || !/^\+?[1-9]\d{1,14}$/.test(to)) {
      return NextResponse.json(
        { error: "Invalid or missing 'to' phone number" },
        { status: 400 }
      );
    }

    const call = await client.calls.create({
      url: "http://demo.twilio.com/docs/voice.xml",
      to,
      from: twilioPhoneNumber!,
    });

    return NextResponse.json({ 
      success: true,
      callSid: call.sid,
      status: call.status 
    });

  } catch (error: unknown) {
    console.error("Twilio call error:", error);
    
    let errorMessage = "An unknown error occurred";
    const statusCode = 500; // Changed let to const here

    if (error instanceof Error) {
      errorMessage = error.message;
      // You could add specific error handling for Twilio errors here
    }

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      }, 
      { status: statusCode }
    );
  }
}
