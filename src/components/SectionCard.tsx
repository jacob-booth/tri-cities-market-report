import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ChartBlock from './ChartBlock';
import FactCheckButton from './FactCheckButton';
import type { Section } from '../types/report';

interface SectionCardProps {
  section: Section;
  onCitationClick: (citationId: number) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
  section,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // const showReadMore = section.content.length > 3;
  // const visibleContent = isExpanded ? section.content : section.content.slice(0, 3);
  // const renderContent = (text: string) => {
  //   return text.replace(/\[(\d+)\]/g, (_, citationId) => {
  //     return `<sup class="citation cursor-pointer text-blue-600 hover:text-blue-800" onclick="handleCitationClick(${citationId})">${citationId}</sup>`;
  //   });
  // };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="booth-card mb-8"
      id={section.id}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-cinzel text-2xl lg:text-3xl font-semibold text-navy-900 dark:text-gray-100 mb-4">
          {section.title}
        </h2>
        
        {/* TL;DR Pill */}
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="booth-pill">
            TL;DR
          </span>
          <p className="text-gray-800 dark:text-gray-200 font-poppins italic font-medium">
            {section.tldr}
          </p>
        </div>
      </div>

      {/* Content Preview */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="relative">
          <p className="text-gray-800 dark:text-gray-200 font-poppins leading-relaxed mb-4">
            {section.content[0]}
          </p>
          {/* Only show fact check for main content that has verified data */}
          {(section.content[0].includes('Johnson City serves as the regional population center') ||
            section.content[0].includes('Median household income') ||
            section.content[0].includes('median age of 35.1') ||
            section.content[0].includes('Ballad Health') ||
            section.content[0].includes('unemployment rate') ||
            section.content[0].includes('Consumer spending') ||
            section.content[0].includes('median home price') ||
            section.content[0].includes('72% growth from 2018-2024') ||
            section.content[0].includes('Nashville') ||
            section.content[0].includes('4-6% annual home price appreciation') ||
            section.content[0].includes('Boone Lake properties') ||
            section.content[0].includes('The Tri-Cities region is experiencing robust') ||
            section.content[0].includes('most affordable market in East Tennessee') ||
            section.content[0].includes('Crime rates significantly below') ||
            section.content[0].includes('95% graduation rate') ||
            section.content[0].includes('21-hospital network')) && (
            <div className="flex justify-end mb-4">
              <FactCheckButton content={section.content[0]} itemIndex={0} />
            </div>
          )}
        </div>
        
        {/* Expand/Collapse Button */}
        {section.content.length > 1 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="booth-button-outline mb-6 inline-flex items-center gap-2"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Read More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && section.content.length > 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
              {section.content.slice(1).map((paragraph, index) => (
                <div key={index} className="relative">
                  <p className="text-gray-800 dark:text-gray-200 font-poppins leading-relaxed">
                    {paragraph}
                  </p>
                  {/* Only show fact check for paragraphs with verified data */}
                  {(paragraph.includes('Johnson City serves as the regional population center') ||
                    paragraph.includes('Median household income') ||
                    paragraph.includes('median age of 35.1') ||
                    paragraph.includes('Ballad Health') ||
                    paragraph.includes('unemployment rate') ||
                    paragraph.includes('Consumer spending') ||
                    paragraph.includes('median home price') ||
                    paragraph.includes('72% growth from 2018-2024') ||
                    paragraph.includes('Nashville') ||
                    paragraph.includes('4-6% annual home price appreciation') ||
                    paragraph.includes('Boone Lake properties') ||
                    paragraph.includes('East Tennessee State University') ||
                    paragraph.includes('Eastman Chemical Company') ||
                    paragraph.includes('The Tri-Cities region') ||
                    paragraph.includes('most affordable market') ||
                    paragraph.includes('Crime rates significantly') ||
                    paragraph.includes('95% graduation') ||
                    paragraph.includes('21-hospital') ||
                    paragraph.includes('Regional population grew') ||
                    paragraph.includes('economic diversity') ||
                    paragraph.includes('Price Forecasting') ||
                    paragraph.includes('Conservative projections')) && (
                    <div className="flex justify-end mt-2 mb-4">
                      <FactCheckButton content={paragraph} itemIndex={index + 1} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charts */}
      {section.charts && section.charts.length > 0 && (
        <div className="mt-8">
          <div className="section-divider" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {section.charts.map((chart, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ChartBlock chart={chart} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* SWOT Analysis */}
      {section.swot && (
        <div className="mt-8">
          <div className="section-divider" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="swot-quadrant strengths"
            >
              <div className="text-center mb-8">
                <h4 className="font-cinzel text-xl font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center justify-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  Strengths
                </h4>
                <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                {section.swot.strengths.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="group relative"
                  >
                    <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-900/10 dark:via-gray-800/50 dark:to-emerald-900/10 
                                  border border-green-200/60 dark:border-green-700/30 rounded-2xl p-5 
                                  hover:shadow-xl hover:shadow-green-200/25 hover:border-green-300/80 dark:hover:border-green-600/50 
                                  transition-all duration-300 cursor-pointer backdrop-blur-sm
                                  transform hover:-translate-y-1">
                      <div className="flex items-center justify-center text-center">
                        <span className="text-gray-700 dark:text-gray-200 font-poppins text-sm leading-relaxed font-medium
                                       group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                          {item}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-emerald-400/5 
                                    rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Weaknesses */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="swot-quadrant weaknesses"
            >
              <div className="text-center mb-8">
                <h4 className="font-cinzel text-xl font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center justify-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  Weaknesses
                </h4>
                <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-rose-500 mx-auto rounded-full"></div>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                {section.swot.weaknesses.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="group relative"
                  >
                    <div className="bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-red-900/10 dark:via-gray-800/50 dark:to-rose-900/10 
                                  border border-red-200/60 dark:border-red-700/30 rounded-2xl p-5 
                                  hover:shadow-xl hover:shadow-red-200/25 hover:border-red-300/80 dark:hover:border-red-600/50 
                                  transition-all duration-300 cursor-pointer backdrop-blur-sm
                                  transform hover:-translate-y-1">
                      <div className="flex items-center justify-center text-center">
                        <span className="text-gray-700 dark:text-gray-200 font-poppins text-sm leading-relaxed font-medium
                                       group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                          {item}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 via-transparent to-rose-400/5 
                                    rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Opportunities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="swot-quadrant opportunities"
            >
              <div className="text-center mb-8">
                <h4 className="font-cinzel text-xl font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center justify-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">★</span>
                  </div>
                  Opportunities
                </h4>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                {section.swot.opportunities.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="group relative"
                  >
                    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-900/10 dark:via-gray-800/50 dark:to-cyan-900/10 
                                  border border-blue-200/60 dark:border-blue-700/30 rounded-2xl p-5 
                                  hover:shadow-xl hover:shadow-blue-200/25 hover:border-blue-300/80 dark:hover:border-blue-600/50 
                                  transition-all duration-300 cursor-pointer backdrop-blur-sm
                                  transform hover:-translate-y-1">
                      <div className="flex items-center justify-center text-center">
                        <span className="text-gray-700 dark:text-gray-200 font-poppins text-sm leading-relaxed font-medium
                                       group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                          {item}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-cyan-400/5 
                                    rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Threats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="swot-quadrant threats"
            >
              <div className="text-center mb-8">
                <h4 className="font-cinzel text-xl font-semibold text-orange-700 dark:text-orange-400 mb-2 flex items-center justify-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">⚠</span>
                  </div>
                  Threats
                </h4>
                <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                {section.swot.threats.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="group relative"
                  >
                    <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-orange-900/10 dark:via-gray-800/50 dark:to-amber-900/10 
                                  border border-orange-200/60 dark:border-orange-700/30 rounded-2xl p-5 
                                  hover:shadow-xl hover:shadow-orange-200/25 hover:border-orange-300/80 dark:hover:border-orange-600/50 
                                  transition-all duration-300 cursor-pointer backdrop-blur-sm
                                  transform hover:-translate-y-1">
                      <div className="flex items-center justify-center text-center">
                        <span className="text-gray-700 dark:text-gray-200 font-poppins text-sm leading-relaxed font-medium
                                       group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                          {item}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-amber-400/5 
                                    rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SectionCard; 