import { Section } from "@/types/romeiv";

export const questions: Section[] = [
    {
      section: "Abdominal Symptoms",
      questions: [
        {
          id: "pain_frequency",
          text: "How often have you experienced abdominal pain in the last 3 months?",
          options: [
            "Less than one day per week",
            "1-2 days per week",
            "3-4 days per week",
            "Most days",
            "Every day",
          ],
        },
        {
          id: "pain_severity",
          text: "How would you rate the severity of your abdominal pain?",
          options: ["Mild", "Moderate", "Severe", "Very severe"],
        },
        {
          id: "pain_defecation_relation",
          text: "Does your abdominal pain improve or worsen with defecation?",
          options: [
            "It improves with defecation",
            "It worsens with defecation",
            "No noticeable change",
          ],
        },
        {
          id: "pain_onset_duration",
          text: "How long have you been experiencing these abdominal symptoms?",
          options: ["Less than 3 months", "3-6 months", "More than 6 months"],
        },
      ],
    },
    {
      section: "Bowel Habits",
      questions: [
        {
          id: "stool_frequency",
          text: "On average, how often do you have a bowel movement?",
          options: [
            "Less than 3 times per week",
            "3 times per week to once per day",
            "1-2 times per day",
            "3-5 times per day",
            "More than 5 times per day",
          ],
        },
        {
          id: "stool_form",
          text: "Which Bristol Stool Form Scale category best describes your most common stool type?",
          options: [
            {
              value: "Type 1 (Separate hard lumps)",
              description: "Hard nuts, difficult to pass",
               image: "https://cdn.prod.website-files.com/621e95f9ac30687a56e4297e/63efa671c11ddb1f5160c578_stool-bristol-scale-type-1.png"
            },
            {
              value: "Type 2 (Lumpy, sausage-like)",
              description: "Lumpy and sausage-shaped",
              image: "https://cdn.prod.website-files.com/621e95f9ac30687a56e4297e/63efae28ea77d36c7988a79b_stool-bristol-scale-type-2.png"
            },
            {
              value: "Type 3 (Sausage shape with cracks)",
              description: "Sausage-shaped with surface cracks",
              image: "https://cdn.prod.website-files.com/621e95f9ac30687a56e4297e/63efa672d1220e120c016147_stool-bristol-scale-type-7.png"
            },
            {
              value: "Type 4 (Smooth, soft sausage or snake)",
              description: "Smooth and soft, snake-like",
              image: "https://cdn.prod.website-files.com/621e95f9ac30687a56e4297e/63efa6733dcbda67f2ff9c44_stool-bristol-scale-type-8.png"
            },
            {
              value: "Type 5 (Soft blobs with clear-cut edges)",
              description: "Soft blobs with clear-cut edges",
              image: "https://cdn.prod.website-files.com/621e95f9ac30687a56e4297e/63efa673fe9098f33d06faa7_stool-bristol-scale-type-9.png"
            },
            {
              value: "Type 6 (Mushy consistency, ragged edges)",
              description: "Mushy stool with ragged edges",
              image: "https://cdn.prod.website-files.com/621e95f9ac30687a56e4297e/63efa6741d56c73c5679a28c_stool-bristol-scale-type-10.png"
            },
            {
              value: "Type 7 (Watery, no solid pieces)",
              description: "Entirely liquid, no solid pieces",
              image: "https://cdn.prod.website-files.com/621e95f9ac30687a56e4297e/63efa6750d9348329c595801_stool-bristol-scale-type-11.png"
            }
          ],
        },
        {
          id: "stool_change_in_frequency",
          text: "Have you noticed a change in how frequently you have bowel movements since your symptoms began?",
          options: [
            "Yes, I go less often now",
            "Yes, I go more often now",
            "No significant change",
          ],
        },
        {
          id: "stool_change_in_form",
          text: "Have you noticed a change in stool form or appearance since your symptoms began?",
          options: [
            "Yes, more on the harder side",
            "Yes, more on the looser/watery side",
            "No significant change",
          ],
        },
      ],
    },
    {
      section: "Additional GI Symptoms",
      questions: [
        {
          id: "bloating",
          text: "How often do you experience bloating or abdominal distension?",
          options: ["Rarely", "Sometimes", "Most days", "Every day"],
        },
        {
          id: "mucus_in_stool",
          text: "Do you notice mucus in your stool?",
          options: ["Never", "Occasionally", "Often"],
        },
        {
          id: "urgency",
          text: "Do you feel an urgent need to have a bowel movement?",
          options: ["Never", "Occasionally", "Often"],
        },
      ],
    },
    {
      section: "Red Flag Symptoms",
      questions: [
        {
          id: "blood_in_stool",
          text: "Have you noticed any blood in your stool?",
          options: ["Never", "Occasionally", "Regularly"],
        },
        {
          id: "nocturnal_diarrhea",
          text: "Do you experience diarrhea that wakes you up at night?",
          options: ["Never", "Occasionally", "Regularly"],
        },
        {
          id: "significant_weight_loss",
          text: "Have you experienced any significant or unexplained weight loss recently?",
          options: ["No", "Yes"],
        },
        {
          id: "family_history_gi",
          text: "Do you have a family history of serious gastrointestinal conditions (e.g., inflammatory bowel disease, colorectal cancer)?",
          options: ["No", "Yes", "Not sure"],
        },
      ],
    },
  ];