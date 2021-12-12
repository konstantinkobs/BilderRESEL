const app = new Vue({
	el: '#app',
	data: {
		imageSrc: null,
		empty: {
			x: 0,
			y: 0,
		},
		size: 3,
		slides: null,
		showHelp: true,
        numMoves: 0,
        hasWon: false,
	},
	methods: {
		swap: function (slide, checkWin = true) {
			if (
				Math.abs(this.empty.x - slide.x) +
					Math.abs(this.empty.y - slide.y) ==
				1
			) {
				[this.empty.x, slide.x] = [slide.x, this.empty.x];
				[this.empty.y, slide.y] = [slide.y, this.empty.y];

                this.numMoves += 1;

				if (checkWin) {
					let won = true;
					for (let i = 0; i < this.slides.length; i++) {
						const slide = this.slides[i];

						if (
							slide.x !== slide.patchX ||
							slide.y !== slide.patchY
						) {
							won = false;
							break;
						}
					}
					if (won) {
						// Let confetti rain for 5 seconds
						confetti.start(5000);
                        this.hasWon = true;
					}
				}
			}
		},
		createSlides: function () {
			let slideData = [];
			for (let y = 0; y < this.size; y++) {
				for (let x = 0; x < this.size; x++) {
					// last element is the empty element
					if (y == this.size - 1 && x == this.size - 1) {
						continue;
					}

					slideData.push({
						x: x,
						y: y,
						patchX: x,
						patchY: y,
					});
				}
			}

			this.slides = slideData;
			this.empty = {
				x: this.size - 1,
				y: this.size - 1,
			};
		},
		shuffleBySwapping: function () {
			for (let i = 0; i < 50 * this.size * this.size * this.size; i++) {
				const slide =
					this.slides[Math.floor(Math.random() * this.slides.length)];
				this.swap(slide, false);
			}

            this.numMoves = 0;
		},
		loadImage: function () {
			const password = localStorage.getItem('password');

			// generate random image ID
            const randomID = Math.floor(Math.random() * numImages);

			// load and decrypt image
			fetch("./enc/" + randomID + ".jpg")
				.then((response) => response.text())
				.then((encrypted) => {
					const decrypted = CryptoJS.AES.decrypt(encrypted, password);
					const base64 = decrypted.toString(CryptoJS.enc.Utf8);
					this.imageSrc = 'data:image/jpg;base64,' + base64;
				})
				.catch((e) => {
					this.imageSrc =
						'https://source.unsplash.com/random/600x600?nature';
				});

			this.createSlides();
			this.shuffleBySwapping();
		},
        initGame: function() {
            // reset settings
            this.numMoves = 0;
            this.hasWon = false;

            if (!localStorage.getItem('password')) {
				const password = prompt('Bitte gib das Passwort ein.');
				if (password) {
					localStorage.setItem('password', password);
				}
			}

			this.loadImage();
        },
	},
	watch: {
		size: function (oldValue, newValue) {
			this.createSlides();
			this.shuffleBySwapping();
		},
	},
	created: function () {
		this.initGame();
	},
});
