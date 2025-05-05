# Cambridge Physics Advisor Chatbot

An AI-powered chatbot that helps prospective postgraduate physics students find suitable programmes and supervisors at the University of Cambridge's Cavendish Laboratory.

## Features

- Interactive chat interface for students to discuss their research interests and educational background
- Programme recommendations based on research interests and course background
- Supervisor recommendations for PhD programmes
- Eligibility checking for international students
- Comprehensive information about MPhil and PhD programmes at Cavendish

## Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [repo-name]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

## Technologies Used

- Next.js
- TypeScript
- OpenAI API
- Tailwind CSS
- Shadcn UI Components

## License

MIT 