"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart, Send, RefreshCw } from "lucide-react";

const mistakeOptions = [
  "Forgot our date 💔",
  "Missed your call 📞",
  "Cancelled plans 😔",
  "Sent a wrong text 📝",
  "GUESS BITCH",
];

const springAnim = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

export default function GrievanceApp() {
  const [mistake, setMistake] = useState("");
  const [customMistake, setCustomMistake] = useState("");
  const [details, setDetails] = useState("");
  const [fixes, setFixes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedMistake = mistake === "GUESS BITCH" ? customMistake : mistake;
  const canSubmit = selectedMistake && fixes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      // First store the submission in database
      const dbResponse = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mistake: selectedMistake,
          details: details || null,
          fixes,
          createdAt: new Date()
        }),
      });

      if (!dbResponse.ok) {
        throw new Error("Failed to save your apology to our records");
      }

      // Then make the phone call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const callRes = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "+916389455824",
          message: `Hey! I'm really sorry for ${selectedMistake}. Here's how I'll make it right: ${fixes}`,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await callRes.json();

      if (!callRes.ok || result.success === false) {
        throw new Error(result.message || "Call initiation failed");
      }

      // Track call status (optional)
      const checkStatus = async (callSid: string) => {
        try {
          const statusRes = await fetch(`/api/call/status?callSid=${callSid}`);
          const status = await statusRes.json();
          console.log("Call status update:", status);
        } catch (statusError) {
          console.log("Status check failed:", statusError);
        }
      };

      setTimeout(() => checkStatus(result.callSid), 5000);
      
      setSubmitted(true);

    } catch (err) {
      console.error("Error:", err);
      alert(
        err instanceof Error 
          ? err.message 
          : "Something went wrong. Your apology might have been recorded but the call failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setMistake("");
    setCustomMistake("");
    setDetails("");
    setFixes("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 flex items-center justify-center p-4 md:p-6">
      <audio autoPlay loop className="hidden">
        <source src="/background.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl rounded-2xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <motion.div 
            className="h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <CardContent className="p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                MAAFI HEROINE AB KYA KARDIA MENE????
              </h1>
            </motion.div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={springAnim}
                  className="text-center space-y-6"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                  >
                    <Heart className="w-16 h-16 mx-auto fill-pink-500 text-pink-500/30" />
                  </motion.div>
                  <div className="space-y-3">
                    <p className="text-xl font-medium text-pink-700">
                      Apology Has Been Asked For! 💌
                    </p>
                    <p className="text-pink-600">
                      Your heartfelt message is on its way  ❤️
                    </p>
                  </div>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="gap-2 border-pink-300 text-pink-600 hover:bg-pink-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    File Another
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={springAnim}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 font-medium text-pink-600/90">
                        Select Mistake
                      </label>
                      <Select onValueChange={setMistake} value={mistake}>
                        <SelectTrigger className="hover:border-pink-300 focus:ring-2 focus:ring-pink-200">
                          <SelectValue placeholder="Choose a mistake." />
                        </SelectTrigger>
                        <SelectContent className="border-0 shadow-lg">
                          {mistakeOptions.map((opt) => (
                            <SelectItem 
                              key={opt} 
                              value={opt}
                              className="hover:bg-pink-50 focus:bg-pink-50"
                            >
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {mistake === "GUESS BITCH" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block mb-2 font-medium text-pink-600/90">
                          Please Specify
                        </label>
                        <Input
                          placeholder="Any Clues day date time person thing??"
                          value={customMistake}
                          onChange={(e) => setCustomMistake(e.target.value)}
                          required
                          className="focus:ring-2 focus:ring-pink-200"
                        />
                      </motion.div>
                    )}

                    <div>
                      <label className="block mb-2 font-medium text-pink-600/90">
                        Details (talk to me like im your girlie)
                      </label>
                      <Textarea
                        placeholder="Tell me more!!  how i messed up this time..."
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="min-h-[100px] focus:ring-2 focus:ring-pink-200"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 font-medium text-pink-600/90">
                        Any ways i could make it right :(Any Suggestions?? Please??)
                      </label>
                      <Textarea
                        placeholder="Is there anyway i can fix this :("
                        value={fixes}
                        onChange={(e) => setFixes(e.target.value)}
                        required
                        className="min-h-[120px] focus:ring-2 focus:ring-pink-200"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                      className={`w-full gap-2 ${canSubmit ? 
                        "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600" : 
                        "bg-pink-300"}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Letting that Bitch Know
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <motion.div 
          className="mt-6 text-center text-sm text-pink-400/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Made with ❤️ only for Shruti Mishra
        </motion.div>
      </motion.div>
    </div>
  );
}