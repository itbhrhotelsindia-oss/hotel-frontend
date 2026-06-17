import React from "react";
import { Link } from "react-router-dom";
import { Check, ArrowLeft, Home, Phone, Calendar, Mail } from "lucide-react";
import { Button } from "../components/ui/button";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-card border border-primary/20 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute -right-8 -top-8 size-32 bg-primary/5 rounded-full" />
        <div className="absolute -left-8 -bottom-8 size-32 bg-secondary/5 rounded-full" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="size-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 animate-in zoom-in duration-500">
            <Check className="size-10" />
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-secondary mb-4">
            Inquiry Received!
          </h1>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Thank you for reaching out to Savanna Retreat Jim Corbett. 
            One of our travel experts will call you within <span className="text-primary font-bold">15 minutes</span> with the best available direct rates for your dates.
          </p>

          <div className="grid gap-4 w-full mb-8">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl text-left border border-border">
              <Phone className="size-5 text-primary shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Immediate Assistance</p>
                <p className="text-sm font-medium">+91 9211283334</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl text-left border border-border">
              <Mail className="size-5 text-primary shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Email Confirmation</p>
                <p className="text-sm font-medium">info@hotaality.com</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Link to="/">
                <Home className="size-4 mr-2" /> GO HOME
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
              <Link to="/jim-corbett-resort">
                <ArrowLeft className="size-4 mr-2" /> BACK TO SITE
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-muted-foreground uppercase tracking-[0.2em]">
        Hotaality Group of Hotels · Jim Corbett
      </p>
    </div>
  );
}
