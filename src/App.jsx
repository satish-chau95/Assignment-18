"use client"

import { useState } from "react"
import { Check, MessageCircle, X, Send, Menu } from "lucide-react"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Checkbox } from "./components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Input } from "./components/ui/input"

export default function CVWritingWebsite() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      message: "Welcome to Careerzooom. For any questions please send a message and we will connect with you asap",
    },
  ])
  const [chatInput, setChatInput] = useState("")

  const navigationItems = ["HOME", "ABOUT US", "PRESENCE", "SAMPLES", "CV REVIEW", "BLOG", "FAQ'S", "CONTACT"]

  const sidebarItems = [
    { name: "CV WRITING", active: true, color: "bg-cyan-400" },
    { name: "CV EDITING", active: false, color: "bg-gray-100" },
    { name: "LINKEDIN PROFILE", active: false, color: "bg-gray-100" },
    { name: "COVER LETTER", active: false, color: "bg-gray-100" },
    { name: "VISUAL RESUME", active: false, color: "bg-gray-100" },
    { name: "72 HOURS DELIVERY", active: false, color: "bg-gray-100" },
  ]

  const serviceFeatures = [
    {
      text: "Professional CV Writers with in-depth industry knowledge and multi-job function specialization covering nearly 50 working areas.",
      highlight: "Professional CV Writers",
    },
    {
      text: "Dedicated writer coordinator who works with you till the end of the project. He will remain your point of contact for any issues or concerns. Transparent communication",
    },
    {
      text: "Skype interview with writer coordinator and/or easy questionnaire to be filled for collecting additional information (only if needed or you will too).",
    },
    {
      text: "All CVs are written from the ground up with a detailed study of your profile. STRICTLY No generic content. STRICTLY No copy-pasting.",
    },
    {
      text: "100% ATS (Applicant Tracking System) compatible with keywords added from your industry. So your CV passes through every time.",
    },
    {
      text: "Receive the first draft in 6-7 days. You can opt for faster delivery by choosing express service and receiving the first draft in 24 hours. That is fast CV Writing.",
    },
    {
      text: "CV is delivered by email in unrestricted MS Word and PDF file formats. You can edit the CV at your end using the MS Word format.",
    },
  ]

  const pricingItems = [
    { name: "LinkedIn Profile", price: "$39", checked: false },
    { name: "Cover Letter", price: "$19", checked: false },
    { name: "Visual Resume", price: "$79", checked: false },
    { name: "LinkedIn Promotion", price: "$79", checked: false },
    { name: "CV Distribution", price: "$69", checked: false },
    { name: "Job Management", price: "$129", checked: false },
    { name: "72 Hours Delivery", price: "$19", checked: false },
  ]

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([
        ...chatMessages,
        { type: "user", message: chatInput },
        { type: "bot", message: "Thank you for your message! Our team will get back to you shortly." },
      ])
      setChatInput("")
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-900 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex space-x-4 lg:space-x-12">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium tracking-wide transition-colors duration-200 relative group"
                >
                  {item}
                  <span className="absolute -bottom-4 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative h-32 sm:h-52 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 overflow-hidden">
        <div className="relative z-10 flex items-center justify-center h-full">
          <h1 className="text-white text-2xl sm:text-5xl font-light tracking-[0.2em] sm:tracking-[0.4em] drop-shadow-lg">
            CV WRITING
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden md:block md:col-span-3">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 sticky top-8">
              {sidebarItems.map((item, index) => (
                <div
                  key={index}
                  className={`${item.active ? "bg-cyan-400 text-white shadow-md" : "bg-gray-50 text-gray-700 hover:bg-gray-100"} 
                    px-4 sm:px-6 py-3 sm:py-4 text-center font-semibold text-xs sm:text-sm border-b border-gray-200 last:border-b-0 
                    transition-all duration-200 cursor-pointer`}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-6">
            <div className="bg-white rounded-lg p-4 sm:p-8 shadow-sm">
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <div className="border-l-4 border-orange-500 pl-4 mb-4 sm:mb-6">
                    <h2 className="text-orange-500 text-xl sm:text-2xl font-bold mb-1 sm:mb-2">CV WRITING</h2>
                    <h3 className="text-orange-500 text-lg sm:text-xl font-semibold">
                      BEST CV WRITING SERVICE IN DUBAI UAE (2025)
                    </h3>
                  </div>
                </div>

                <div>
                  <p className="text-gray-800 font-medium mb-4 sm:mb-6 text-base sm:text-lg underline decoration-2 underline-offset-4">
                    Our unmatched CV Writing Service includes the below
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {serviceFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg border-l-4 border-cyan-400"
                    >
                      <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-cyan-400 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                        {feature.highlight ? (
                          <>
                            <span className="text-cyan-600 font-semibold">{feature.highlight}</span>
                            {feature.text.replace(feature.highlight, "")}
                          </>
                        ) : (
                          feature.text
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-1 md:col-span-3">
            <Card className="shadow-xl border-2 border-gray-200 overflow-hidden sticky top-8">
              <CardHeader className="text-center bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <CardTitle className="text-gray-700 text-base sm:text-lg font-bold tracking-wide">CV WRITING</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="relative inline-block">
                    <div className="bg-cyan-400 text-white px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold rounded-full mb-2 sm:mb-3 shadow-md">
                      SAVE $0
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-1">$39</div>
                  <div className="text-gray-400 line-through text-sm sm:text-lg">$39</div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2 block">CAREER LEVEL</label>
                    <Select>
                      <SelectTrigger className="w-full border-2 border-gray-200 focus:border-cyan-400 text-xs sm:text-sm">
                        <SelectValue placeholder="0 to 1 year Experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0 to 1 year Experience</SelectItem>
                        <SelectItem value="2-5">2 to 5 years Experience</SelectItem>
                        <SelectItem value="5+">5+ years Experience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-xs text-gray-600 italic bg-yellow-50 p-2 sm:p-3 rounded-lg border-l-4 border-yellow-400">
                    * Prices shown are per year experience and career level
                  </div>

                  <div className="text-xs sm:text-sm text-gray-700 font-medium">
                    Add services to get attractive discounts
                  </div>

                  <div className="space-y-2 sm:space-y-3 bg-gray-50 p-3 sm:p-4 rounded-lg">
                    {pricingItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Checkbox id={`item-${index}`} className="border-2 border-gray-300 h-4 w-4" />
                          <label htmlFor={`item-${index}`} className="text-gray-700 font-medium cursor-pointer">
                            {item.name}
                          </label>
                        </div>
                        <span className="text-cyan-600 font-bold">{item.price}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold py-2 sm:py-3 text-sm sm:text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
                    BUY NOW →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        {isChatOpen && (
          <div className="mb-3 w-72 sm:w-80 bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-white p-3 sm:p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold text-sm sm:text-base">Careerzooom Support</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white hover:bg-white/20 p-1 rounded">
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            <div className="h-48 sm:h-64 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs p-2 sm:p-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm ${
                      msg.type === "user"
                        ? "bg-cyan-400 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 sm:p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border-2 border-gray-200 focus:border-cyan-400 text-xs sm:text-sm"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-cyan-400 hover:bg-cyan-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-md"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-xl sm:shadow-2xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {!isChatOpen && (
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-[8px] sm:text-xs font-bold animate-bounce">
            1
          </div>
        )}
      </div>
    </div>
  )
}