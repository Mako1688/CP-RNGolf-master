class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2))
        wallA.setVelocityX(100)
        wallA.body.setCollideWorldBounds(true)
        wallA.body.setBounce(1)
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width /2, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '14px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        // Initialize counters
        this.shots = 0
        this.goals = 0
        this.successfulShots = 0

        // Display counters
        this.shotsText = this.add.text(0, 20, 'Shots: 0', menuConfig)
        this.goalsText = this.add.text(0, 40, 'Goals: 0', menuConfig)
        this.successfulShotsText = this.add.text(0, 60, 'Success Rate: 0%', menuConfig)

        // // add pointer input
        // this.mouseInput = this.input.on('pointerdown', (pointer) => {
        //     let shotDirection = pointer.y <= this.ball.y ? 1 : -1
        //     this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
        //     this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
        // })

        // new mouse click logic
        this.mouseInput = this.input.on('pointerdown', (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1;

            // Calculate the relative x-position of the pointer with respect to the ball
            let relativeX = pointer.x - this.ball.x;

            // Set the x-velocity based on the relative x-position
            this.ball.body.setVelocityX(relativeX * shotDirection);

            // Set the y-velocity
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection);

            // Increment shots counter
            this.shots += 1
            this.shotsText.setText('Shots: ' + this.shots)
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            // Increment counters
            this.goals += 1
            this.successfulShots += 1
            this.shots += 1

            // Update display
            this.shotsText.setText('Shots: ' + this.shots)
            this.goalsText.setText('Goals: ' + this.goals)
            this.successfulShotsText.setText('Success Rate: ' + ((this.successfulShots / this.shots) * 100).toFixed(2) + '%')

            // Reset ball position and velocity
            ball.body.reset(width / 2, height - height / 10);
            ball.body.setVelocity(0, 0);
            ball.body.setAcceleration(0, 0);

        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)


        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)
        
    }

    update() {
        // if(wallA.x >= 560) {
        //     wallA.setVelocityX(-100)
        // }else if(wallA.x <= 80) {
        //     wallA.setVelocityX(100)
        // }

        // if(this.mouseInput.leftButton.isDown()){
        //     this.score +=1
        // }
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[!!!] Add ball reset logic on successful shot
[!!!] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[!!!] Make one obstacle move left/right and bounce against screen edges
[!!!] Create and display shot counter, score, and successful shot percentage
*/