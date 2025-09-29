import React, { useState, useEffect } from 'react';
import { Search, Upload, X, Users, Briefcase, Clock, MapPin, DollarSign } from 'lucide-react';

export default function RiotMindsWebsite() {
  const [activeSection, setActiveSection] = useState('home');
  const [content, setContent] = useState({
    home: {
      heroTitle1: "Connect with Top",
      heroTitle2: "Freelance Talent",
      heroDescription: "Riot Minds brings together exceptional freelancers and businesses seeking quality work. Join our growing network today.",
      ctaButton1: "Join as Freelancer",
      ctaButton2: "Browse Talent",
      features: [
        { title: "Quality Network", description: "Connect with verified freelancers across multiple disciplines", icon: "Users" },
        { title: "Diverse Skills", description: "Find experts in design, development, marketing, and more", icon: "Briefcase" },
        { title: "Flexible Hours", description: "Work with talent across different timezones and schedules", icon: "Clock" }
      ]
    },
    about: {
      pageTitle: "About Riot Minds",
      paragraph1: "Riot Minds is a curated freelancer network designed to connect businesses with exceptional independent professionals. We believe in the power of flexible work and the incredible talent that exists in the freelance community.",
      paragraph2: "Our platform makes it easy for freelancers to showcase their skills, rates, and availability, while giving businesses a streamlined way to discover and connect with the right talent for their projects.",
      paragraph3: "Whether you're a freelancer looking to expand your network or a business seeking quality professionals, Riot Minds is here to make those connections happen.",
      missionTitle: "Our Mission",
      missionText: "To empower freelancers and businesses by creating meaningful connections that drive success for everyone involved."
    },
    jobRoles: {
      roles: [
        "Web Developer",
        "Graphic Designer",
        "Content Writer",
        "Social Media Manager",
        "Video Editor",
        "SEO Specialist",
        "UI/UX Designer",
        "Digital Marketer",
        "Copywriter",
        "Photographer",
        "Other"
      ]
    },
    formSettings: {
      formTitle: "Join Our Network",
      successMessage: "Successfully submitted! Redirecting to freelancer directory...",
      freelancersTitle: "Our Talent Network",
      searchPlaceholder: "Search by name, role, or location...",
      emptyMessage: "No freelancers found. Be the first to join!"
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    state: '',
    jobRole: '',
    customJobRole: '',
    rate: '',
    availability: '',
    workingHours: '',
    timezone: '',
    portfolioLinks: ['', '', '', '', ''],
    requestedServices: ''
  });
  const [files, setFiles] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const homeResponse = await fetch('/content/home.json');
        const aboutResponse = await fetch('/content/about.json');
        const jobRolesResponse = await fetch('/content/jobRoles.json');
        const formSettingsResponse = await fetch('/content/formSettings.json');

        if (homeResponse.ok) {
          const homeData = await homeResponse.json();
          setContent(prev => ({ ...prev, home: homeData }));
        }
        if (aboutResponse.ok) {
          const aboutData = await aboutResponse.json();
          setContent(prev => ({ ...prev, about: aboutData }));
        }
        if (jobRolesResponse.ok) {
          const jobRolesData = await jobRolesResponse.json();
          setContent(prev => ({ ...prev, jobRoles: jobRolesData }));
        }
        if (formSettingsResponse.ok) {
          const formSettingsData = await formSettingsResponse.json();
          setContent(prev => ({ ...prev, formSettings: formSettingsData }));
        }
      } catch (error) {
        console.log('Using default content');
      }
    };
    loadContent();
  }, []);

  const timezones = [
    'UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6',
    'UTC-5', 'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC+0', 'UTC+1',
    'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5', 'UTC+6', 'UTC+7', 'UTC+8',
    'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12'
  ];

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'Users': return <Users className="w-12 h-12 text-purple-600 mb-4" />;
      case 'Briefcase': return <Briefcase className="w-12 h-12 text-purple-600 mb-4" />;
      case 'Clock': return <Clock className="w-12 h-12 text-purple-600 mb-4" />;
      default: return <Users className="w-12 h-12 text-purple-600 mb-4" />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...formData.portfolioLinks];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, portfolioLinks: newLinks }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.size <= 10 * 1024 * 1024);
    if (validFiles.length < selectedFiles.length) {
      alert('Some files exceed 10MB limit and were excluded');
    }
    setFiles(prev => [...prev, ...validFiles].slice(0, 10));
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.city || !formData.state || !formData.jobRole) {
      alert('Please fill in all required fields (Name, Email, City, State, Job Role)');
      return;
    }

    if (formData.jobRole === 'Other' && !formData.customJobRole) {
      alert('Please specify your job role');
      return;
    }

    const finalJobRole = formData.jobRole === 'Other' ? formData.customJobRole : formData.jobRole;
    
    const newFreelancer = {
      id: Date.now(),
      name: formData.name,
      location: `${formData.city}, ${formData.state}`,
      jobRole: finalJobRole,
      rate: formData.rate,
      availability: formData.availability,
      workingHours: formData.workingHours,
      timezone: formData.timezone,
      portfolioLinks: formData.portfolioLinks.filter(link => link.trim() !== ''),
      files: files.map(f => f.name)
    };

    setFreelancers(prev => [...prev, newFreelancer]);
    setSubmitted(true);
    
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        city: '',
        state: '',
        jobRole: '',
        customJobRole: '',
        rate: '',
        availability: '',
        workingHours: '',
        timezone: '',
        portfolioLinks: ['', '', '', '', ''],
        requestedServices: ''
      });
      setFiles([]);
      setSubmitted(false);
      setActiveSection('freelancers');
    }, 2000);
  };

  const filteredFreelancers = freelancers.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg"></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Riot Minds
              </span>
            </div>
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveSection('home')}
                className={`${activeSection === 'home' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'} px-3 py-2 font-medium transition`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveSection('about')}
                className={`${activeSection === 'about' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'} px-3 py-2 font-medium transition`}
              >
                About Us
              </button>
              <button
                onClick={() => setActiveSection('signup')}
                className={`${activeSection === 'signup' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'} px-3 py-2 font-medium transition`}
              >
                Join Network
              </button>
              <button
                onClick={() => setActiveSection('freelancers')}
                className={`${activeSection === 'freelancers' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'} px-3 py-2 font-medium transition`}
              >
                Find Talent
              </button>
            </div>
          </div>
        </div>
      </nav>

      {activeSection === 'home' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {content.home.heroTitle1}
              <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {content.home.heroTitle2}
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              {content.home.heroDescription}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setActiveSection('signup')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition"
              >
                {content.home.ctaButton1}
              </button>
              <button
                onClick={() => setActiveSection('freelancers')}
                className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition"
              >
                {content.home.ctaButton2}
              </button>
            </div>
          </div>
          
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {content.home.features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                {getIcon(feature.icon)}
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'about' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">{content.about.pageTitle}</h2>
          <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <p className="text-lg text-gray-700">{content.about.paragraph1}</p>
            <p className="text-lg text-gray-700">{content.about.paragraph2}</p>
            <p className="text-lg text-gray-700">{content.about.paragraph3}</p>
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-2xl font-bold mb-4">{content.about.missionTitle}</h3>
              <p className="text-lg text-gray-700">{content.about.missionText}</p>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'signup' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">{content.formSettings.formTitle}</h2>
          
          {submitted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">{content.formSettings.successMessage}</p>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Role *
              </label>
              <select
                name="jobRole"
                value={formData.jobRole}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              >
                <option value="">Select a role</option>
                {content.jobRoles.roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {formData.jobRole === 'Other' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Please specify your role *
                </label>
                <input
                  type="text"
                  name="customJobRole"
                  value={formData.customJobRole}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hourly Rate (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  placeholder="50"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select timezone</option>
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Working Hours per Day
                </label>
                <input
                  type="text"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleInputChange}
                  placeholder="e.g., 4-6 hours"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Availability Status
              </label>
              <input
                type="text"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                placeholder="e.g., Available immediately, Starting next month"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Portfolio Links (up to 5)
              </label>
              {formData.portfolioLinks.map((link, index) => (
                <input
                  key={index}
                  type="url"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  placeholder={`Link ${index + 1}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent mb-2"
                />
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Portfolio Files (up to 10, max 10MB each)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Choose files to upload
                </label>
                <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Request Additional Services to be Added
              </label>
              <textarea
                name="requestedServices"
                value={formData.requestedServices}
                onChange={handleInputChange}
                placeholder="If you offer services not listed in our dropdown, please describe them here..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition"
            >
              Submit Application
            </button>
          </div>
        </div>
      )}

      {activeSection === 'freelancers' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">{content.formSettings.freelancersTitle}</h2>
          
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={content.formSettings.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>
          </div>

          {filteredFreelancers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{content.formSettings.emptyMessage}</p>
              <button
                onClick={() => setActiveSection('signup')}
                className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Join Network
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFreelancers.map(freelancer => (
                <div key={freelancer.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{freelancer.name}</h3>
                      <p className="text-purple-600 font-semibold">{freelancer.jobRole}</p>
                    </div>
                    {freelancer.rate && (
                      <div className="bg-green-50 px-3 py-1 rounded-full">
                        <p className="text-green-700 font-bold">${freelancer.rate}/hr</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{freelancer.location}</span>
                    </div>
                    {freelancer.timezone && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{freelancer.timezone}</span>
                      </div>
                    )}
                    {freelancer.workingHours && (
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{freelancer.workingHours}</span>
                      </div>
                    )}
                    {freelancer.availability && (
                      <div className="mt-2 bg-blue-50 px-3 py-2 rounded">
                        <p className="text-blue-700 text-xs font-semibold">{freelancer.availability}</p>
                      </div>
                    )}
                  </div>

                  {freelancer.portfolioLinks.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Portfolio</p>
                      <div className="space-y-1">
                        {freelancer.portfolioLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-600 hover:underline block truncate"
                          >
                            {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
