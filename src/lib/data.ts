import { ChatUser, Message } from "./type";
import userOne from "@/assets/Avatar.svg";
import userTwo from "@/assets/Avatar (1).svg";
import userThree from "@/assets/Avatar (2).svg";
import userFour from "@/assets/Avatar (3).svg";
import userFive from "@/assets/Avatar (4).svg";
import userSix from "@/assets/Avatar (5).svg";
import userSeven from "@/assets/Avatar (6).svg";
import userEight from "@/assets/Avatar (7).svg";

export const chatUsers: ChatUser[] = [
  {
    id: "1",
    name: "Dustin",
    avatar: userOne,
    lastMessage: "But I, that am not shaped for spo...",
    timestamp: "3:51 am",
  },
  {
    id: "2",
    name: "Jorge",
    avatar: userTwo,
    lastMessage: "But I, that am not shaped for sport...",
    timestamp: "4:50 am",
  },
  {
    id: "3",
    name: "Philip",
    avatar: userThree,
    lastMessage: "But I, that am not shaped for sport...",
    timestamp: "4:35 am",
    unread: true,
  },
  {
    id: "4",
    name: "Marvin",
    avatar: userFour,
    lastMessage: "But I, that am not shaped for sport...",
    timestamp: "5:40 am",
  },
  {
    id: "5",
    name: "Nathan",
    avatar: userFive,
    lastMessage: "But I, that am not shaped for spo...",
    timestamp: "4:15 am",
  },
  {
    id: "6",
    name: "Randall",
    avatar: userSix,
    lastMessage: "But I, that am not shaped for spo...",
    timestamp: "8:31 am",
  },
  {
    id: "7",
    name: "Mitchell",
    avatar: userSeven,
    lastMessage: "But I, that am not shaped for sport...",
    timestamp: "7:25am",
  },
  {
    id: "8",
    name: "Brandon",
    avatar: userEight,
    lastMessage: "But I, that am not shaped for spo...",
    timestamp: "5:20 am",
  },
];

export const messages: Message[] = [
  {
    id: "1",
    userId: "user1",
    userName: "",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "I'm just working on a our AD project. What about you ?",
    timestamp: "07:59 pm",
  },
  {
    id: "2",
    userId: "user2",
    userName: "",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "In a laoreet purus. Integer turpis quam, laoreet id orci nec, ultrices lacinia nunc. Aliquam erat volutpat. Curabitur fringilla in purus eget egestas.",
    timestamp: "08:01 pm",
  },
  {
    id: "3",
    userId: "user1",
    userName: "",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "I'm just working on a our AD project. What about you ?",
    timestamp: "08:03 pm",
  },
  {
    id: "4",
    userId: "user2",
    userName: "",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Same here! Been working project for the past 5 hours despite of having so much to do",
    timestamp: "",
    // reactions: ["👍", "😊"],
  },
  {
    id: "5",
    userId: "user1",
    userName: "",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "I'm just working on a our AD project. What about you ?",
    timestamp: "08:10 pm",
  },
  {
    id: "6",
    userId: "user2",
    userName: "",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Same here! Been working project for the past 5 hours despite of having so much to do",
    timestamp: "08:12 pm",
  },
  {
    id: "6",
    userId: "user2",
    userName: "",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Same here! Been working project for the past 5 hours despite of having so much to do",
    timestamp: "08:12 pm",
  },
  {
    id: "6",
    userId: "user2",
    userName: "",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Same here! Been working project for the past 5 hours despite of having so much to do",
    timestamp: "08:12 pm",
  },
  {
    id: "6",
    userId: "user2",
    userName: "",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Same here! Been working project for the past 5 hours despite of having so much to do",
    timestamp: "08:12 pm",
  },
  {
    id: "6",
    userId: "user2",
    userName: "",
    avatar: "/placeholder.svg?height=32&width=32",
    content:
      "Same here! Been working project for the past 5 hours despite of having so much to do",
    timestamp: "08:12 pm",
  },
];

export const countryConfig = {
  BH: {
    country: "Bahrain",
    currencyCode: "BHD",
    currencyName: "Bahraini Dinar",
    paymentMethods: [],
    requiredBankFields: [
      "account_holder_name",
      "account_number",
      "bank_name",
      "bank_address",
      "iban",
      "swift_code",
    ],
  },
  QA: {
    country: "Qatar",
    currencyCode: "QAR",
    currencyName: "Qatari Riyal",
    paymentMethods: [],
    requiredBankFields: [
      "account_holder_name",
      "account_number",
      "bank_name",
      "iban",
      "swift_code",
    ],
  },
  SA: {
    country: "KSA",
    currencyCode: "SAR",
    currencyName: "Saudi Riyal",
    paymentMethods: [],
    requiredBankFields: [
      "account_holder_name",
      "account_number",
      "bank_name",
      "iban",
      "swift_code",
    ],
  },
  KW: {
    country: "Kuwait",
    currencyCode: "KWD",
    currencyName: "Kuwaiti Dinar",
    paymentMethods: [],
    requiredBankFields: [
      "account_holder_name",
      "account_number",
      "bank_name",
      "iban",
      "swift_code",
    ],
  },
  AE: {
    country: "UAE",
    currencyCode: "AED",
    currencyName: "Emirati Dirham",
    paymentMethods: [],
    requiredBankFields: [
      "account_holder_name",
      "account_number",
      "bank_name",
      "iban",
      "swift_code",
    ],
  },
  OM: {
    country: "Oman",
    currencyCode: "OMR",
    currencyName: "Omani Rial",
    paymentMethods: [],
    requiredBankFields: [
      "account_holder_name",
      "account_number",
      "bank_name",
      "iban",
      "swift_code",
    ],
  },
  TR: {
    country: "Turkey",
    currencyCode: "TRY",
    currencyName: "Turkish Lira",
    paymentMethods: [],
    requiredBankFields: [
      "account_holder_name",
      "account_number",
      "bank_name",
      "iban",
      "swift_code",
    ],
  },
  TN: {
    country: "Tunisia",
    currencyCode: "TND",
    currencyName: "Tunisian Dinar",
    paymentMethods: [],
    requiredBankFields: ["account_holder_name", "account_number", "bank_name"],
  },
  MA: {
    country: "Morocco",
    currencyCode: "MAD",
    currencyName: "Moroccan Dirham",
    paymentMethods: [],
    requiredBankFields: ["account_holder_name", "account_number", "bank_name"],
  },
  BD: {
    country: "Bangladesh",
    currencyCode: "BDT",
    currencyName: "Bangladeshi Taka",
    paymentMethods: [],
    requiredBankFields: [
      "account_holder_name",
      "account_number",
      "bank_name",
      "branch_name",
      "bank_address",
    ],
  },
  GB: {
    country: "United Kingdom",
    currencyCode: "GBP",
    currencyName: "Pound Sterling",
    paymentMethods: [],
    requiredBankFields: [
      "account_holder_name",
      "account_number",
      "sort_code",
      "bank_name",
    ],
  },
  US: {
    country: "United States",
    currencyCode: "USD",
    currencyName: "United States Dollar",
    paymentMethods: [],
    requiredBankFields: [
      "account_holder_name",
      "account_number",
      "routing_number",
      "bank_name",
      "bank_address",
    ],
  },
};
