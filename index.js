// phina.js をグローバル領域に展開
phina.globalize();

// 定数
const ASSETS = {
    image: {
        virus: "./img/virus.png",
        hand: "./img/hand.png"
    }
};
const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 960;
const VIRUS_SIZE = 100; 

// MainScene クラスを定義
phina.define("MainScene", {
    superClass: "DisplayScene",
    init: function() {
        this.superInit();
        Sprite("hand", SCREEN_WIDTH, SCREEN_HEIGHT)
            .addChildTo(this)
            .setPosition(this.gridX.center(), this.gridY.span(10));
        Label({
            text: "ウイルスをタッチして滅菌しよう！",
            fontSize: 30,
            fill: "red",
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(1));
        this.virusGroup = DisplayElement().addChildTo(this);
        this.count = 0;
        const self = this;
        (10).times(i =>this.increaseVirus());
        setTimeout(() => this.exit({
            score: self.count
        }), 10 * 1000);
        setInterval(() =>this.increaseVirus(), 500);
    },
    increaseVirus: function(){
        const self = this;
        const virus = Sprite("virus", VIRUS_SIZE, VIRUS_SIZE)
                .addChildTo(this.virusGroup)
                .setPosition(
                    Random.randint(VIRUS_SIZE/2, SCREEN_WIDTH - VIRUS_SIZE/2),
                    Random.randint(VIRUS_SIZE/2, SCREEN_HEIGHT - VIRUS_SIZE/2)
                );
            virus.setInteractive(true);
            virus.onpointstart = function() {
                self.count++;
                this.remove();
            };
    }
});

phina.define("BonusScene", {
    superClass: "DisplayScene",
    init: function(param) {
        this.superInit(param);
        this.count = param.score;
        const self = this;
        Label({
            text: "ボーナスタイム！\nボタンを押して給付金を増やせ！",
            fontSize: 30,
            fill: "red",
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(1));
        const label_score = Label({
            text: this.count,
            fontSize: 54,
            fill: "white",
        }).addChildTo(this).setPosition(this.gridX.center(),this.gridY.center());
        const button = Button().addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(10));
        button.text = "+";
        button.onpointend = ()=>{
            this.count++;
            label_score.text = this.count;
        };
        setTimeout(() => this.exit({
            score: self.count,
            message: self.count + "万円給付！",
            hashtags: "stay_home"
        }), 3 * 1000);
    }
});

// メイン処理
phina.main(function () {
    // アプリケーション生成
    const app = GameApp({
        title: "給付金を獲得しよう！",
        startLabel: "TitleScene",
        scenes: [
            {
                className: "TitleScene",
                label: "TitleScene",
                nextLabel: "MainScene",
            },
            {
                className: "MainScene",
                label: "MainScene",
                nextLabel: "BonusScene",
            },
            {
                className: "BonusScene",
                label: "BonusScene",
                nextLabel: "ResultScene",
            },
            {
                className: "ResultScene",
                label: "ResultScene",
                nextLabel: "TitleScene",
            },
        ],
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "#444",
        assets: ASSETS
    });
    // アプリケーション実行
    app.run();
});