import { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text } from "@/components/Text";
import { ChevronDown, X } from "lucide-react-native";
import PageHeader from "./_components/PageHeader";

const FAQS = [
  {
    question: "How is this different from Duolingo?",
    answer:
      "Immerbot focuses on comprehensible input through real conversation, rather than gamified drills. You learn by understanding, not by memorizing isolated exercises.",
  },
  {
    question: "What is \"comprehensible input\"?",
    answer:
      "Comprehensible input is language you can mostly understand, with just enough new material to stretch your ability. It's the input your brain needs to acquire language naturally.",
  },
  {
    question: "How does Immerbot know what words I know?",
    answer:
      "Immerbot builds a vocabulary model from the words you save and encounter. Every conversation is calibrated against this model so new material stays in your \"i+1\" zone.",
  },
  {
    question: "Will I actually become fluent?",
    answer:
      "Fluency comes from sustained comprehensible input over time. Immerbot is designed to keep you in that zone consistently, which is the same mechanism behind natural first-language acquisition.",
  },
  {
    question: "Why is writing feedback a premium feature?",
    answer:
      "Writing feedback requires more intensive model usage to give accurate, personalized corrections, so it's part of the premium tier to keep the core experience free.",
  },
  {
    question: "Is my conversation data private?",
    answer:
      "Conversation content is used to provide the service and to update your vocabulary model. It is never sold or used for advertising. You can delete all your data at any time from Settings.",
  },
];

export default function About() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View className="flex-1 bg-background-light">
      <PageHeader title="About" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40, gap: 16 }}
      >
        <View className="bg-white rounded-[14px] border border-foreground/[0.1] p-5">
          <Text weight="bold" className="text-lg text-foreground mb-3">
            The methodology
          </Text>
          <Text fontFamily="serif" className="text-[15px] leading-[26px] text-foreground-secondary mb-3">
            Immerbot is built on Stephen Krashen's Comprehensible Input Hypothesis, one of the
            most replicated theories in applied linguistics. The core claim is simple: we acquire
            language by understanding it, not by consciously studying it.
          </Text>
          <Text fontFamily="serif" className="text-[15px] leading-[26px] text-foreground-secondary mb-3">
            The "i+1" principle describes the ideal learning zone — input that is mostly
            comprehensible but contains a handful of unknown elements. This is the sweet spot
            where acquisition happens naturally, the same way children learn their first
            language.
          </Text>
          <Text fontFamily="serif" className="text-[15px] leading-[26px] text-foreground-secondary">
            Every conversation in Immerbot is calibrated to your known vocabulary. As you
            encounter and save new words, your vocabulary model expands, and future conversations
            automatically reflect your growth.
          </Text>
        </View>

        <View className="bg-white rounded-[14px] border border-foreground/[0.1] p-4">
          <Text weight="bold" className="text-xs uppercase tracking-wider text-foreground-tertiary mb-1">
            Frequently asked questions
          </Text>

          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <View key={faq.question} className="border-b border-foreground/[0.06]">
                <Pressable
                  onPress={() => setOpenIndex(isOpen ? null : index)}
                  className="flex-row items-start gap-2.5 py-3.5"
                >
                  <Text weight="medium" className="flex-1 text-sm leading-[20px] text-foreground">
                    {faq.question}
                  </Text>
                  {isOpen ? (
                    <X size={16} color="#BFAD9F" strokeWidth={1.75} style={{ marginTop: 2 }} />
                  ) : (
                    <ChevronDown size={16} color="#BFAD9F" strokeWidth={1.75} style={{ marginTop: 2 }} />
                  )}
                </Pressable>
                {isOpen && (
                  <Text
                    fontFamily="serif"
                    className="text-sm leading-[23px] text-foreground-secondary pb-3.5"
                  >
                    {faq.answer}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
