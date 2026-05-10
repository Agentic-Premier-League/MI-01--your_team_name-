const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function screenCandidate(resumeText, jobDescription) {
  try {
    const prompt = `
    You are an AI recruiting assistant. Evaluate the following resume against the job description.
    Provide a match score from 0 to 100 representing how well the candidate fits the role.
    If the score is less than 70, you must also provide exactly a 50-word rejection feedback explaining why the candidate was rejected.
    
    Format the output as JSON:
    {
      "score": <number>,
      "feedback": "<string or null>"
    }

    Job Description:
    ${jobDescription}

    Resume:
    ${resumeText}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("OpenAI Screening Error:", error);
    // Fallback if AI fails
    return { score: 0, feedback: "Error evaluating candidate." };
  }
}

async function generateFeedbackSummary(techScore, knowledgeGap, additionalComment) {
  try {
    const prompt = `
    You are an AI HR assistant. A recruiter has rejected a candidate after an interview and provided the following feedback:
    - Technical Score (1-5): ${techScore}
    - Knowledge Gap Score (1-5): ${knowledgeGap}
    - Additional Comments: ${additionalComment}

    Write a polite, professional, and constructive 3-paragraph rejection summary to be shared directly with the candidate based on these inputs.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }]
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Feedback Gen Error:", error);
    return "Thank you for interviewing. At this time, we have decided to move forward with other candidates.";
  }
}

async function chatWithCandidate(message, history, resumeText, jobDescription) {
  try {
    const systemPrompt = `
    You are an AI Hiring Chatbot helping a candidate understand a job role and their fit for it.
    Use the provided Job Description and the Candidate's Resume to answer their questions.
    
    Job Description:
    ${jobDescription}

    Candidate's Resume:
    ${resumeText}
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Chat Error:", error);
    return "I am currently experiencing issues, please try again later.";
  }
}

module.exports = {
  screenCandidate,
  generateFeedbackSummary,
  chatWithCandidate
};
