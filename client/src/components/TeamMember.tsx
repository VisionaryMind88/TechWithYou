interface TeamMemberProps {
  name: string;
  title: string;
  description: string;
  image: string;
  socials: {
    linkedin: string;
    twitter: string;
    email: string;
  };
}

export const TeamMember = ({
  name,
  title,
  description,
  image,
  socials,
}: TeamMemberProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="flex space-x-4">
            <a
              href={socials.linkedin}
              className="text-white hover:text-neutral-200 transition"
            >
              <i className="ri-linkedin-fill text-xl"></i>
            </a>
            <a
              href={socials.twitter}
              className="text-white hover:text-neutral-200 transition"
            >
              <i className="ri-twitter-fill text-xl"></i>
            </a>
            <a
              href={socials.email}
              className="text-white hover:text-neutral-200 transition"
            >
              <i className="ri-mail-fill text-xl"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-1">{name}</h3>
        <p className="text-primary font-medium mb-3">{title}</p>
        <p className="text-neutral-600 text-sm">{description}</p>
      </div>
    </div>
  );
};
