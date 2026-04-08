import { useLanguage } from "../context/LanguageContext";
import WorkshopsPageContent from "../content/pages/workshops-page.json";

const NoWorkshopsImage = "/uploads/images/workshops/workshop_empty.png";

const WorkshopsEmptyState = () => {
	// For language switching
	const { currentLang } = useLanguage();
	const t = (field) => field?.[currentLang] ?? field?.en ?? "";
	return (
		<div className="workshops-empty">
			<img
				className="workshops-empty__image"
				src={NoWorkshopsImage}
				alt=""
			/>
			<div className="workshops-empty__content">
				<h2 className="workshops-empty__title main-title">
					{t(WorkshopsPageContent.emptyState.title)}
				</h2>
				{WorkshopsPageContent.emptyState.info.paragraphs.map(
					(paragraph, index) => (
						<article
							key={index}
							className="workshops-empty__info text"
						>
							{t(paragraph)}
						</article>
					),
				)}
				{/* <p className="workshops-empty__info">
					Join our mailing list to be the first to hear about new workshop
					dates. <br></br>
					<br></br>We also offer custom private workshops for groups of friends
					or colleagues — a magical creative experience where each guest makes a
					unique handmade piece.
					<br></br> <br></br>
					Please contact us to arrange a private workshop — we’ll create a
					magical experience tailored just for you.



				</p> */}
			</div>
		</div>
	);
};

export default WorkshopsEmptyState;
