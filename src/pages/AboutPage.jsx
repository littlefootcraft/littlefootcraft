//AboutPage.jsx

import { PrimaryBtn } from "../components/PrimaryBtn";
// import { SecondaryBtn } from "../components/SecondaryBtn";
import AboutPageTopImage from "./../../public/uploads/images/about_page_top.jpeg";

import { WandSparkles, Star, Heart, Gem, Sparkles } from "lucide-react";

const AboutPage = () => {
	return (
		<section className="about">
			<section className="about__top">
				<div className="about__top-content container">
					<div className="about__top-info">
						<span>Our story</span>
						<h2 className="about__top-title main-title">
							The Artisan Behind the Magic
						</h2>
						<article className="about__top-text text">
							Welcome to LittleFootCraft. Is where art lives in its smallest and
							most vibrant forms. It is a space where ordinary things transform
							into something more — into stories, emotions, and a way of
							self-expression.
						</article>
					</div>
					<img
						className="about__top-image"
						src={AboutPageTopImage}
						alt="Workshop top image"
					/>
				</div>
			</section>
			<section className="about__story">
				<div className="about__story-content container">
					<h2 className="about__story-title main-title">
						The Story Behind the Magic
					</h2>
					<article className="about__story-text text">
						Each piece is created with attention to detail, with love for
						textures, colors and feelings. We are inspired by the beauty of
						imperfection, the uniqueness of every element, and the magic of
						transformation. We believe that objects can have a soul — especially
						those made by hand and with intention.
						<br />
						<br /> The name of the brand carries a special story. As a child, I
						deeply loved The Land Before Time. Its main character — a little
						dinosaur — was brave, curious, and able to see beauty in the world
						around him. That image stayed with me and became the inspiration
						behind the name, reflecting my creative approach — one of curiosity,
						sensitivity, and a quiet sense of adventure. <br />
						<br />
						Here you will find not just accessories or décor, but meaningful
						objects that help reveal your individuality. Choose what truly
						resonates with you. Style is not seen — it’s felt.
					</article>
				</div>
			</section>
			<section className="about__values">
				<div className="container">
					<div className="about__values-header">
						<h2 className="about__values-title main-title">Our Values</h2>
						<p className="about__values-text">
							The principles that guide every piece we create
						</p>
					</div>
					<div className="about__values-items">
						<div className="about__values-item">
							<WandSparkles className="about__values-item-icon" />
							<h4 className="about__values-item-title">Handcrafted Magic</h4>
							<p className="about__values-item-text">
								Every piece is meticulously crafted by hand, ensuring unique
								character and quality.
							</p>
						</div>
						<div className="about__values-item">
							<Star className="about__values-item-icon" />
							<h4 className="about__values-item-title">One of a Kind</h4>
							<p className="about__values-item-text">
								No mass production. Each creation exists as a singular treasure
								in the world.
							</p>
						</div>
						<div className="about__values-item">
							<Heart className="about__values-item-icon" />
							<h4 className="about__values-item-title">Made with Love</h4>
							<p className="about__values-item-text">
								Passion and care infuse every stage of our creative process.
							</p>
						</div>
						<div className="about__values-item">
							<Gem className="about__values-item-icon" />
							<h4 className="about__values-item-title">Finest Materials</h4>
							<p className="about__values-item-text">
								We source only the most exceptional materials for our enchanted
								creations.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="about__cta">
				<div className="about__cta-content container">
					<Sparkles className="about__cta-icon" />

					<h2 className="about__cta-title main-title">
						Ready to Find Your Treasure?
					</h2>

					<p className="about__cta-text">
						Explore our collection and discover the piece that speaks to your
						soul.
					</p>

					<PrimaryBtn
						className="about__cta-button"
						variant="to-catalog"
						to="/shop"
					>
						Explore Collection
					</PrimaryBtn>
				</div>
			</section>
		</section>
	);
};

export default AboutPage;
