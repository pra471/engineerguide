import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { BookOpen } from 'lucide-react';
import Layout from '../components/common/Layout';
import { useNavigate } from 'react-router-dom';

const cardData = [
	{
		key: 'ket',
		title: 'KET Admission',
		color: 'from-blue-900 via-blue-950 to-pink-950',
		icon: <BookOpen className="h-8 w-8 text-blue-400 mb-4" />,
	},
	{
		key: 'comedk',
		title: 'COMEDK Admission',
		color: 'from-pink-900 via-yellow-800 to-blue-900',
		icon: <BookOpen className="h-8 w-8 text-pink-400 mb-4" />,
	},
	{
		key: 'management',
		title: 'Management Quota',
		color: 'from-gray-900 via-blue-950 to-pink-950',
		icon: <BookOpen className="h-8 w-8 text-yellow-400 mb-4" />,
	},
];

const AdmissionPage: React.FC = () => {
	const navigate = useNavigate();

	return (
		<Layout>
			<div className="py-12 min-h-screen w-full bg-gradient-to-r from-gray-900 via-blue-900 to-pink-900 rounded-none px-4 md:px-8 mt-8">
				<div className="w-full min-h-screen rounded-2xl bg-gradient-to-br from-gray-900 via-blue-950 to-pink-950 shadow-2xl border-2 border-blue-900 px-4 md:px-8 flex flex-col items-center justify-center">
					<motion.h1
						className="text-4xl md:text-5xl font-extrabold text-gradient mb-6 drop-shadow-lg leading-tight md:leading-[1.15] pb-2 text-center mt-12"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						Admission Guidance
					</motion.h1>
					<motion.p
						className="text-xl text-gray-300 mb-8 text-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						Step-by-step details for KET, COMEDK, and Management quota
						admissions.
					</motion.p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16">
						{cardData.map((card) => (
							<motion.div
								key={card.key}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4 }}
								className={`bg-gradient-to-br ${card.color} rounded-2xl shadow-xl border-2 border-blue-900 p-8 flex flex-col items-center hover:scale-105 transition-transform duration-300 cursor-pointer relative`}
								onClick={() => navigate(`/admission/${card.key}`)}
							>
								{card.icon}
								<h3 className="text-xl font-bold text-gradient mb-2 drop-shadow text-center">
									{card.title}
								</h3>
								<p className="text-gray-300 text-sm mb-4 text-center">
									Tap to view step-by-step admission process.
								</p>
								<Button className="mt-auto bg-gradient-to-r from-pink-900 via-yellow-800 to-blue-900 text-gray-100 font-bold shadow hover:from-yellow-700 hover:to-blue-800">
									View Steps
								</Button>
								<Button
									className="mb-2 bg-blue-900 text-white px-4 py-1"
									onClick={(e) => {
										e.stopPropagation();
										navigate(`/admission/${card.key}/help`);
									}}
								>
									Help / Ask a Question
								</Button>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default AdmissionPage;
