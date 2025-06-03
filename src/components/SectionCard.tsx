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
          <div className="flex justify-end mb-4">
            <FactCheckButton content={section.content[0]} itemIndex={0} />
          </div>
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
                  <div className="flex justify-end mt-2 mb-4">
                    <FactCheckButton content={paragraph} itemIndex={index + 1} />
                  </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="swot-quadrant strengths"
            >
              <h4 className="font-cinzel text-lg font-semibold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Strengths
              </h4>
              <ul className="space-y-3">
                {section.swot.strengths.map((item, index) => (
                  <li key={index} className="text-gray-800 dark:text-gray-200 font-poppins text-sm">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                      <span className="flex-1">{item}</span>
                    </div>
                    <div className="ml-4">
                      <FactCheckButton content={item} itemIndex={index} />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Weaknesses */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="swot-quadrant weaknesses"
            >
              <h4 className="font-cinzel text-lg font-semibold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Weaknesses
              </h4>
              <ul className="space-y-3">
                {section.swot.weaknesses.map((item, index) => (
                  <li key={index} className="text-gray-800 dark:text-gray-200 font-poppins text-sm">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-red-500 mt-1 flex-shrink-0">•</span>
                      <span className="flex-1">{item}</span>
                    </div>
                    <div className="ml-4">
                      <FactCheckButton content={item} itemIndex={index} />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Opportunities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="swot-quadrant opportunities"
            >
              <h4 className="font-cinzel text-lg font-semibold text-blue-700 dark:text-blue-400 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Opportunities
              </h4>
              <ul className="space-y-3">
                {section.swot.opportunities.map((item, index) => (
                  <li key={index} className="text-gray-800 dark:text-gray-200 font-poppins text-sm">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                      <span className="flex-1">{item}</span>
                    </div>
                    <div className="ml-4">
                      <FactCheckButton content={item} itemIndex={index} />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Threats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="swot-quadrant threats"
            >
              <h4 className="font-cinzel text-lg font-semibold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                Threats
              </h4>
              <ul className="space-y-3">
                {section.swot.threats.map((item, index) => (
                  <li key={index} className="text-gray-800 dark:text-gray-200 font-poppins text-sm">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-orange-500 mt-1 flex-shrink-0">•</span>
                      <span className="flex-1">{item}</span>
                    </div>
                    <div className="ml-4">
                      <FactCheckButton content={item} itemIndex={index} />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SectionCard; 