import { MapPin, Phone, MessageCircle } from 'lucide-react';

interface ContactButtonsProps {
  phoneNumber: string;
  vendorName: string;
}

export const ContactButtons = ({ phoneNumber, vendorName }: ContactButtonsProps) => {
  // Format phone number for WhatsApp (remove spaces and add country code if needed)
  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove spaces and special characters
    const cleaned = phone.replace(/[^0-9+]/g, '');
    // If it starts with +261, keep it as is; otherwise assume Madagascar
    return cleaned.startsWith('+261') ? cleaned : `+261${cleaned.slice(1)}`;
  };

  const whatsappPhone = formatPhoneForWhatsApp(phoneNumber);
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=Bonjour, je suis intéressé par votre annonce sur InfoMada.`;
  const callUrl = `tel:${phoneNumber}`;

  return (
    <div className="flex flex-col gap-3 w-full">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center justify-center gap-2 w-full">
        <MessageCircle size={20} />
        Contacter via WhatsApp
      </a>
      <a href={callUrl} className="btn-secondary flex items-center justify-center gap-2 w-full">
        <Phone size={20} />
        Appeler
      </a>
    </div>
  );
};
