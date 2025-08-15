"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import {
  RiArrowRightLine,
  RiCheckboxCircleFill,
  RiTimeLine,
  RiCloseLine,
  RiUserLine,
  RiCalendarLine,
  RiFileTextLine,
  RiMoneyDollarCircleLine,
  RiBuilding4Line,
  RiArrowLeftRightLine,
  RiAlertLine,
  RiCheckLine,
  RiEyeLine,
  RiHistoryLine,
  RiChat1Line,
} from "react-icons/ri"
import { SiBritishairways, SiMastercard, SiSlack } from "react-icons/si"

// Sample approval requests
const approvalRequests = [
  {
    id: "REQ-2025-04-28-001",
    title: "Business Trip to London",
    amount: "$3,450.00",
    submittedBy: "Alex Morgan",
    submittedOn: "Apr 28, 2025",
    department: "Sales",
    category: "Travel",
    vendor: "British Airways",
    vendorIcon: <SiBritishairways className="text-black" />,
    paymentMethod: "Corporate Card",
    cardLast4: "4582",
    cardIcon: <SiMastercard className="text-black" />,
    description: "Sales conference attendance and client meetings",
    status: "in-review",
    currentStep: 2,
    steps: [
      {
        id: 1,
        name: "Submission",
        status: "completed",
        actor: "Alex Morgan",
        date: "Apr 28, 2025",
        time: "09:14 AM",
        notes: "Submitted for approval",
      },
      {
        id: 2,
        name: "Manager Review",
        status: "in-progress",
        actor: "Sarah Johnson",
        date: "Pending",
        time: "",
        notes: "",
      },
      {
        id: 3,
        name: "Finance Review",
        status: "pending",
        actor: "Finance Team",
        date: "Pending",
        time: "",
        notes: "",
      },
      {
        id: 4,
        name: "Final Approval",
        status: "pending",
        actor: "System",
        date: "Pending",
        time: "",
        notes: "",
      },
    ],
    lineItems: [
      {
        id: 1,
        description: "Flight Ticket (Round Trip)",
        amount: "$1,850.00",
        category: "Airfare",
        date: "May 15-22, 2025",
      },
      {
        id: 2,
        description: "Hotel Accommodation (7 nights)",
        amount: "$1,400.00",
        category: "Lodging",
        date: "May 15-22, 2025",
      },
      {
        id: 3,
        description: "Transportation",
        amount: "$200.00",
        category: "Local Transport",
        date: "May 15-22, 2025",
      },
    ],
    comments: [
      {
        id: 1,
        author: "Alex Morgan",
        text: "Attending the annual sales conference and meeting with potential clients.",
        date: "Apr 28, 2025",
        time: "09:14 AM",
      },
    ],
  },
  {
    id: "REQ-2025-04-27-002",
    title: "Software Subscription Renewal",
    amount: "$1,200.00",
    submittedBy: "Jamie Wilson",
    submittedOn: "Apr 27, 2025",
    department: "Engineering",
    category: "Software",
    vendor: "Slack",
    vendorIcon: <SiSlack className="text-black" />,
    paymentMethod: "Corporate Card",
    cardLast4: "7693",
    cardIcon: <SiMastercard className="text-black" />,
    description: "Annual enterprise plan renewal",
    status: "approved",
    currentStep: 4,
    steps: [
      {
        id: 1,
        name: "Submission",
        status: "completed",
        actor: "Jamie Wilson",
        date: "Apr 27, 2025",
        time: "11:32 AM",
        notes: "Submitted for approval",
      },
      {
        id: 2,
        name: "Manager Review",
        status: "completed",
        actor: "Daniel Chess",
        date: "Apr 27, 2025",
        time: "02:45 PM",
        notes: "Approved - Essential software",
      },
      {
        id: 3,
        name: "Finance Review",
        status: "completed",
        actor: "Maria Levey",
        date: "Apr 28, 2025",
        time: "10:15 AM",
        notes: "Verified against budget",
      },
      {
        id: 4,
        name: "Final Approval",
        status: "completed",
        actor: "System",
        date: "Apr 28, 2025",
        time: "10:16 AM",
        notes: "Automatically approved",
      },
    ],
    lineItems: [
      {
        id: 1,
        description: "Slack Enterprise Plan (Annual)",
        amount: "$1,200.00",
        category: "Software Subscription",
        date: "May 01, 2025 - Apr 30, 2026",
      },
    ],
    comments: [
      {
        id: 1,
        author: "Jamie Wilson",
        text: "Annual renewal for our team communication platform.",
        date: "Apr 27, 2025",
        time: "11:32 AM",
      },
      {
        id: 2,
        author: "Daniel Chess",
        text: "Approved. This is essential for our team's communication.",
        date: "Apr 27, 2025",
        time: "02:45 PM",
      },
      {
        id: 3,
        author: "Maria Levey",
        text: "Verified against department budget. Proceeding with approval.",
        date: "Apr 28, 2025",
        time: "10:15 AM",
      },
    ],
  },
]

export default function ApprovalWorkflow() {
  const [activeRequest, setActiveRequest] = useState(0)
  const [activeTab, setActiveTab] = useState("details")
  const request = approvalRequests[activeRequest]

  // Function to determine step status class
  const getStepStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gray-200 text-gray-700 border-gray-200"
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "pending":
        return "bg-gray-100 text-gray-500 border-gray-200"
      default:
        return "bg-gray-100 text-gray-500 border-gray-200"
    }
  }

  // Function to determine step icon
  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <RiCheckboxCircleFill className="text-gray-700" size={16} />
      case "in-progress":
        return <RiTimeLine className="text-blue-700" size={16} />
      case "pending":
        return <RiTimeLine className="text-gray-400" size={16} />
      default:
        return <RiTimeLine className="text-gray-400" size={16} />
    }
  }

  // Function to determine request status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center rounded-xl bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            <RiCheckLine className="mr-1" size={12} />
            Approved
          </span>
        )
      case "rejected":
        return (
          <span className="inline-flex items-center rounded-xl bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
            <RiCloseLine className="mr-1" size={12} />
            Rejected
          </span>
        )
      case "in-review":
        return (
          <span className="inline-flex items-center rounded-xl bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            <RiTimeLine className="mr-1" size={12} />
            In Review
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center rounded-xl bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
            <RiTimeLine className="mr-1" size={12} />
            Pending
          </span>
        )
    }
  }

  return (
    <div className="relative py-20 overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[9px] font-medium text-gray-700">
              <Image
                src="/logo/suitpax-bl-logo.webp"
                alt="Suitpax"
                width={60}
                height={15}
                className="h-3 w-auto mr-1"
              />
              Expense Management
            </span>
            <span className="inline-flex items-center rounded-xl bg-gray-200 px-2.5 py-0.5 text-[8px] font-medium text-gray-700">
              <span className="w-1 h-1 rounded-full bg-black animate-pulse mr-1"></span>
              Launching Q3 2025
            </span>
          </div>

          <motion.h2
            className="text-4xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black leading-none max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Multi-Step Approval Workflow
          </motion.h2>

          <motion.p
            className="mt-6 text-sm font-medium text-gray-600 max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Streamline expense approvals with customizable workflows that ensure compliance while maintaining efficiency
          </motion.p>
        </div>

        {/* Main approval interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Left panel - Request list */}
          <motion.div
            className="lg:col-span-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium tracking-tighter">Pending Approvals</h3>
              <span className="text-xs text-gray-500">View all</span>
            </div>

            <div className="space-y-4">
              {approvalRequests.map((req, index) => (
                <div
                  key={req.id}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    activeRequest === index
                      ? "border-gray-300 bg-gray-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveRequest(index)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{req.title}</h4>
                    {getStatusBadge(req.status)}
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <span>{req.id}</span>
                    <span className="font-medium text-black">{req.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium">
                        {req.submittedBy.charAt(0)}
                      </div>
                      <span className="text-xs">{req.submittedBy}</span>
                    </div>
                    <span className="text-xs text-gray-500">{req.submittedOn}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right panel - Approval details */}
          <motion.div
            className="lg:col-span-8 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Approval progress */}
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium tracking-tighter">Approval Progress</h3>
                {getStatusBadge(request.status)}
              </div>

              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-4 top-4 h-[calc(100%-32px)] w-0.5 bg-gray-200"></div>

                {/* Steps */}
                <div className="space-y-6">
                  {request.steps.map((step) => (
                    <div key={step.id} className="flex items-start relative">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${getStepStatusClass(
                          step.status,
                        )}`}
                      >
                        {getStepIcon(step.status)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{step.name}</h4>
                            <p className="text-xs text-gray-500">{step.actor}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium">{step.date}</p>
                            {step.time && <p className="text-xs text-gray-500">{step.time}</p>}
                          </div>
                        </div>
                        {step.notes && <p className="text-xs text-gray-600 mt-1">{step.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Request details tabs */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === "details"
                        ? "text-black border-b-2 border-black"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    <span className="flex items-center">
                      <RiFileTextLine className="mr-1.5" />
                      Details
                    </span>
                  </button>
                  <button
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === "lineItems"
                        ? "text-black border-b-2 border-black"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("lineItems")}
                  >
                    <span className="flex items-center">
                      <RiMoneyDollarCircleLine className="mr-1.5" />
                      Line Items
                    </span>
                  </button>
                  <button
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === "comments"
                        ? "text-black border-b-2 border-black"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("comments")}
                  >
                    <span className="flex items-center">
                      <RiChat1Line className="mr-1.5" />
                      Comments
                    </span>
                  </button>
                  <button
                    className={`px-6 py-3 text-sm font-medium ${
                      activeTab === "history"
                        ? "text-black border-b-2 border-black"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("history")}
                  >
                    <span className="flex items-center">
                      <RiHistoryLine className="mr-1.5" />
                      History
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === "details" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Request Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <RiFileTextLine className="text-gray-500 mt-0.5 mr-2" size={16} />
                          <div>
                            <p className="text-xs text-gray-500">Description</p>
                            <p className="text-sm">{request.description}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <RiMoneyDollarCircleLine className="text-gray-500 mt-0.5 mr-2" size={16} />
                          <div>
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="text-sm font-medium">{request.amount}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <RiBuilding4Line className="text-gray-500 mt-0.5 mr-2" size={16} />
                          <div>
                            <p className="text-xs text-gray-500">Department</p>
                            <p className="text-sm">{request.department}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <RiArrowLeftRightLine className="text-gray-500 mt-0.5 mr-2" size={16} />
                          <div>
                            <p className="text-xs text-gray-500">Category</p>
                            <p className="text-sm">{request.category}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-4">Vendor & Payment</h4>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md mt-0.5 mr-2">
                            {request.vendorIcon}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Vendor</p>
                            <p className="text-sm">{request.vendor}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md mt-0.5 mr-2">
                            {request.cardIcon}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Payment Method</p>
                            <p className="text-sm">
                              {request.paymentMethod} (•••• {request.cardLast4})
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <RiUserLine className="text-gray-500 mt-0.5 mr-2" size={16} />
                          <div>
                            <p className="text-xs text-gray-500">Submitted By</p>
                            <p className="text-sm">{request.submittedBy}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <RiCalendarLine className="text-gray-500 mt-0.5 mr-2" size={16} />
                          <div>
                            <p className="text-xs text-gray-500">Submitted On</p>
                            <p className="text-sm">{request.submittedOn}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "lineItems" && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium">Line Items</h4>
                      <p className="text-xs text-gray-500">
                        Total: <span className="font-medium text-black">{request.amount}</span>
                      </p>
                    </div>
                    <div className="border rounded-xl overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Description
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Category
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {request.lineItems.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{item.category}</td>
                              <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">{item.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "comments" && (
                  <div>
                    <h4 className="text-sm font-medium mb-4">Comments</h4>
                    <div className="space-y-4">
                      {request.comments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-gray-50 rounded-xl">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                {comment.author.charAt(0)}
                              </div>
                              <span className="text-sm font-medium">{comment.author}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {comment.date} at {comment.time}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                      ))}

                      <div className="mt-4">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                            S
                          </div>
                          <div className="flex-1">
                            <textarea
                              className="w-full border border-gray-200 rounded-xl p-3 text-sm"
                              placeholder="Add a comment..."
                              rows={2}
                            ></textarea>
                            <div className="flex justify-end mt-2">
                              <button className="px-4 py-1.5 bg-black text-white text-xs font-medium rounded-lg">
                                Add Comment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div>
                    <h4 className="text-sm font-medium mb-4">Approval History</h4>
                    <div className="space-y-3">
                      {request.steps
                        .filter((step) => step.status === "completed")
                        .map((step) => (
                          <div key={step.id} className="flex items-start">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-700`}
                            >
                              <RiCheckboxCircleFill size={14} />
                            </div>
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="text-sm font-medium">{step.name}</h5>
                                  <p className="text-xs text-gray-500">
                                    {step.actor} • {step.date} {step.time}
                                  </p>
                                </div>
                              </div>
                              {step.notes && <p className="text-xs text-gray-600 mt-1">{step.notes}</p>}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {request.status === "in-review" && (
              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                  Request Changes
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors">
                  Reject
                </button>
                <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors">
                  Approve
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
              <RiArrowLeftRightLine className="text-gray-700" size={20} />
            </div>
            <h3 className="text-lg font-medium tracking-tighter mb-2">Customizable Workflows</h3>
            <p className="text-sm text-gray-600">
              Design approval workflows that match your organizational structure with multiple approval levels and
              conditions.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
              <RiAlertLine className="text-gray-700" size={20} />
            </div>
            <h3 className="text-lg font-medium tracking-tighter mb-2">Policy Enforcement</h3>
            <p className="text-sm text-gray-600">
              Automatically enforce company policies with AI-powered validation and real-time compliance checks.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl mb-4">
              <RiEyeLine className="text-gray-700" size={20} />
            </div>
            <h3 className="text-lg font-medium tracking-tighter mb-2">Complete Visibility</h3>
            <p className="text-sm text-gray-600">
              Track every approval step with detailed audit trails and real-time status updates for all stakeholders.
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            whileHover={{ y: -2 }}
            whileTap={{ y: 1 }}
          >
            <button className="inline-flex items-center justify-center bg-white text-black hover:bg-white/90 px-8 py-3 rounded-xl text-sm font-medium tracking-tighter shadow-lg w-full sm:w-auto min-w-[220px] transition-colors relative group overflow-hidden">
              <span className="relative z-10 flex items-center">
                Request Demo <RiArrowRightLine className="ml-2" />
              </span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-sky-300 via-white to-sky-300 opacity-30 group-hover:opacity-50 blur-xl transition-all duration-500 animate-flow-slow"></span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
