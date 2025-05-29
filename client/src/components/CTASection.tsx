import AdminEditableContent from "./AdminEditableContent";

interface CTASectionProps {
  onOpenRegistration: () => void;
}

export default function CTASection({ onOpenRegistration }: CTASectionProps) {
  return (
    <AdminEditableContent section="cta">
      {(content, isEditing, startEdit, editableText) => (
        <section className="cta py-24 bg-gradient-to-br from-primary to-secondary text-white text-center relative overflow-hidden">
          {/* Decorative SVG background */}
          <div className="absolute inset-0 opacity-30 pointer-events-none select-none">
            <svg width="100%" height="100%" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <g fill="white" fillOpacity="0.1">
                <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" />
              </g>
            </svg>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {editableText('title', 'Ready to Start Learning?', 'text-4xl md:text-5xl font-bold mb-4')}
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              {editableText('subtitle', 'Join thousands of students already learning with us', 'text-lg md:text-xl mb-8 opacity-90')}
            </p>
            <button
              onClick={onOpenRegistration}
              className="btn btn-primary btn-large bg-white text-primary font-semibold px-8 py-4 rounded-full shadow-lg hover:-translate-y-1 hover:bg-gray-100 transition-all text-lg"
            >
              {editableText('button', 'Get Started for Free', 'inline-block')}
            </button>
          </div>
        </section>
      )}
    </AdminEditableContent>
  );
} 