import express from "express";
import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// const PORT = 3000;
const token = '7011738182:AAFIT_nJFg6qlIi28IRJAttbmAsJAjPmdcs';

let bot = new TelegramBot(token, {polling: {interval: 300, autoStart: true}});
const openApiKey = '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';

const userStorage = new Map();


console.log(new Date().getHours())
const users = {
    admin: {
        id: 6564665663,
        name: '',
        number_phone: ''
    },
    psych: {
        id: 920340411,
        name: '',
        number_phone: ''
    },
    community: {
        id: -4160203466,
        name: 'Сообщество CATARISE'
    }
}

const commands = [
    {
        command: "start",
        description: "Запуск"
    },
    {
        command: "continue", 
        description: "Продолжить"
    },
    {
        command: "chat_therapy",
        description: "Чат-терапия"
    },
    {
        command: "additional_resources",
        description: "Поддержка и дополнительные ресурсы"
    },
    {
        command: "feedback",
        description: "Обратная связь и оценка"
    }, 
    {
        command: "community_support",
        description: "Поддержка сообщества"
    },
    {
        command: "complete",
        description: "Завершить "
    }
];


async function checkMembership(communityId, userId) {
    let member = await bot.getChatMember(communityId, userId);
    return member.status;
}


bot.setMyCommands(commands);


// app.listen(PORT, () => console.log(`'My server is running on port ${PORT}`));



bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userData = userStorage.get(chatId) || {};
    userData.range = 0;

    userData.answer = [];
    
    function sendBotMessage() {
        bot.sendMessage(chatId, `Как вы себя чувствуете сейчас? Какие эмоции вы испытываете и почему? Если сложно описать, это нормально. Попробуйте рассказать о своих чувствах, это поможет вам понять себя лучше.?`);
    }
    const bigInterval = 24 * 60* 60 * 1000;

    function setReminders() {
    
        // Задаем начальное время как 7:00
        const startTime = new Date();
        startTime.setHours(7, 0, 0, 0);
    
        // Задаем конечное время как 23:00
        const endTime = new Date();
        endTime.setHours(23, 0, 0, 0);
    

        let times_arr = [2, 5, 8, 11, 14];
        // let minute_arr = [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
        let currentTime = startTime.getTime();
        if (currentTime <= endTime.getTime()) {

            for (let i = 0; i < times_arr.length; i++ ) {

                let send_time = new Date();
                send_time.setHours(times_arr[i] , 0, 0, 0);

                let wait_time = send_time - Date.now();

                if ( wait_time > 0 ) {
                    setTimeout(sendBotMessage, wait_time);
                    console.log(wait_time)
                } else {
                    let time_last = bigInterval + wait_time;
                    setTimeout(sendBotMessage, time_last);
                    console.log(time_last);
                }

            }
        }
    }


    try {
/*----------------------------------------------------------------------COMMAND--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
            if( msg.text && msg.text.startsWith("/start") && !userData.complete_stage){
                console.log(chatId);
                userStorage.set(chatId, userData);

                setReminders();
                setInterval( setReminders, bigInterval);


                await bot.sendMessage(chatId, `Вы подтверждаете, что являетесь совершеннолетним и осознаете, что ответы ИИ несут ознакомительный характер, не являются призывом к действию, и могут быть ошибочными.
    Сіз өзіңіздің кәмелетке толған екеніңізді растайсыз және AI жауаптары ақпараттық сипатта болатынын, әрекетке шақыру емес екенін және қате болуы мүмкін екенін түсінесіз.`, { reply_markup: { remove_keyboard: true }});
                


                await bot.sendMessage(chatId, `Привет, дорогой пользователь. 
Сәлем, құрметті қолданушы.
Выбери язык: русский, казахский. 
Тілді таңдаңыз: орыс, қазақ.
Мы твой личный психологический помощник-друг. 
Біз сіздің жеке психологиялық көмекшіңіз-досымыз.
                `, {
                    reply_markup: {
                        inline_keyboard: [[
                            {
                                text: 'Русский',
                                callback_data: 'русский'
                            },
                            {
                                text: 'Қазақша', 
                                callback_data: 'казахский'
                            }]
                        ]
                    }
                });
            }  else if ( msg.text === '/continue' ) {
                
                
                bot.sendMessage(chatId, `С возврашением пользователь! Давай мы заново пройдемся по твоему памяти и вспомним о нас`);
                await bot.sendMessage(chatId, `Мы твой личный психологический помощник-друг.`);
                await bot.sendMessage(chatId, `Что может получить пользователь\nЗдесь ты можешь: обучиться эмоциональному интеллекту, выговориться, получить обратную связь, и это все абсолютно конфиденциально.`);
                await bot.sendMessage(chatId, `Как работает наш чат-бот:\nПервый шаг-это пройти тест, где ты сможешь увидеть свое состояние на данный момент. каждый день, ты будешь получать новое, обучающее видео по эмоциональному интеллекту, если ты хочешь рассказать о каком-то болезненном моменте, тебе следует перейти в чат-терапию. После 5 раз в день, ты будешь получать сообщение, которое будет узнавать о ваших эмоциях в определенный момент, эта практика, поможет тебе понимать свои чувства.`);
                await bot.sendVideo(chatId, './Доп материалы/IMG_5621.MOV');
                await bot.sendMessage(chatId, `На чем продолжим?`, {
                    reply_markup: {
                        keyboard: [
                            ["/chat_therapy", "/additional_resources", "/community"]
                        ]
                    }
                })
                
            } else if ( msg.text === '/community') {
                bot.sendMessage(chatId, `Залетайте в наше сообщество :)`, {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Гоооу',
                                    url: 'https://t.me/+YOHu0CRVmLczOWQy',
                                    callback_data: 'community'
                                }
                            ]
                        ]
                    }
                })
            } else if (msg.text === '/feedback') {
                userData.feedback_stage = 'wait_feedback';
                userStorage.set(chatId, userData);

                bot.sendMessage(chatId, `Привет! Мы хотим сделать нашу платформу лучше для вас. Пожалуйста, поделитесь своим мнением о нашем сервисе. Что вам понравилось? Что можно улучшить? Ваши идеи и предложения очень ценны для нас! Благодарим за ваше время!`);

            } else if (userData && userData.feedback_stage === 'wait_feedback') {
                userData.feedback_stage = 'received';
                userStorage.set(chatId, userData);

                bot.sendMessage(users.admin.id, msg.text);
                bot.sendMessage(chatId, `Спасибо, Вы делаете нас лучше!`);

            } else if (msg.text === '/chat_therapy') {

                if ( (userData.answer_1 && userData.answer_2 && userData.answer_3 && userData.answer_4 && userData.answer_5 && userData.answer_6 && userData.answer_7 && userData.answer_8 && userData.answer_9 && userData.answer_10) || userData.community_stage === 'true' ) {
                    bot.sendMessage(chatId, `Тут вы сможете поговорить с искуственным интеллектом-помощником, пройти как терапию`, {
                        reply_markup: {
                            inline_keyboard: [[{
                                text: 'Начать терапию',
                                callback_data: 'chat_therapy'
                            }]]
                        }
                    });
                } else {

                    bot.sendMessage(chatId, `Прошу сначала получите 1 ранг для пользования чат терапией`);

                }

            } else if (msg.text === '/additional_resources') {

                if ( chatId === users.psych.id || chatId === 6963757337 ) {

                    bot.sendMessage(chatId, `Вы в этом боте в роли психолога и имеете право отправлять ресурсы, для этого просто отправляйте все что хотите, ВСЕ сообщения будут отправлены другим как допольнительные ресурсы`, {
                        reply_markup: {
                            inline_keyboard: [[{
                                text: "Прекратить отправку",
                                callback_data: "stop_send_all_resourses"
                            }]]
                        }
                    });
                    userData.all_resourses = 'true';
                    userData.psych_stage = 'wait_resources'
                    userStorage.set(chatId, userData);

                } else {

                    await bot.sendMessage(chatId, `Контакты для связи с поддержкой если срочно нужна помощь 87025185030`);
                    bot.sendMessage(chatId, `Тут будут собраны ресурсы подобранные лично для тебя`);

                }
                
            } else if ( msg.text === '/complete') {


                    if ( userData.query === 'да' ) {

                        bot.sendMessage(chatId, `Спасибо, дорогой друг, сегодня ты сделал свою жизнь чуточку лучше!\nПроведи оплату прямо сейчас и получи скидку 80%- 1200 тг`, {
                            reply_markup: {
                                inline_keyboard: [[{
                                    text: 'Оплатить',
                                    url: 'https://t.me/adiyarais',
                                    callback_data: 'pay'
                                }]]
                            }
                        });
                    } else if ( userData.query === 'ия' ) {

                        bot.sendMessage(chatId, `Рахмет, қымбатты досым, бүгін сен өз өміріңді біршама жақсарттың!\nТөлемді дәл қазір жүргізіп, 80% жеңілдік алыңыз-1200 тг`, {
                            reply_markup: {
                                inline_keyboard: [[{
                                    text: 'Төлем жүгізу',
                                    url: 'https://t.me/adiyarais',
                                    callback_data: 'pay'
                                }]]
                            }
                        });
                    }

            } else if ( msg.text === '/community_support' ) {

                const member = await checkMembership(users.community.id, chatId);

                if ( member === 'member' ) {
                    await userData.range++;
                    userData.community_stage = 'true';
                    userStorage.set(chatId, userData);
                    if ( userData.answer_stage === 'true' ) {
                        userData.range++
                        userStorage.set(chatId, userData);

                        bot.sendMessage(chatId, `Поздравляю вы получили ${userData.range} ранг.`);
                    } else {
                        await bot.sendMessage(chatId, `Поздравляю вы получили ${userData.range} ранг. Теперь вы можете пользоваться чат терапией, для пользования нажмите /chat_therapy`);

                    }


                } else {

                    await bot.sendMessage(chatId, `Друг, ты можешь вступить в сообщество где, ты сможешь познакомиться с другими участниками, посещать программы по психологии, участвовать в ивент-мероприятиях, первым узнавать о новшествах бесплатно до 05.05.2024`, {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    {
                                        text: 'gooo',
                                        url: 'https://t.me/+YOHu0CRVmLczOWQy',
                                        callback_data: 'community'
                                    }
                                ]
                            ]
                        }
                    });
        

                }

            } else if ( userData.psych_stage == 'wait_resources' ) {

                if(userData.user_stage != 'true' && chatId != users.psych.id) {
                    let userIdResourses;
                    let arr = [...userStorage.keys()];
                    
                    for ( let id = 0; id < arr.length; id++ ) {
                        if ( arr[id] == parseInt(msg.text) ) {
                            userData.user_stage = 'true';
                            userIdResourses = parseInt(msg.text);
                            userData.user_id = userIdResourses;
                            userStorage.set(chatId, userData);

                            bot.sendMessage(chatId, `Внимание вы собираетесь отправлять ресурсы пользователю с id ${userIdResourses}. Помните если вы закончить отправку ресурвсов отправьте /send_resourses`);
                        } else {
                            continue;
                        }
                    }
                } else if (userData.all_resourses === 'true') {
                    let arr = [...userStorage.keys()];
                    for( let id = 0; id < arr.length; id++ ) {
                        bot.forwardMessage(arr[id], chatId, msg.message_id);

                    }

                } else if ( msg.text == '/send_resources') {

                    await bot.sendMessage(chatId, `Вы закончили отправку ресурсов пользователю ${userData.user_id}`);

                    await bot.sendMessage(userData.user_id, `Поздравляю вы получили свой первый ресурс от нашего специалиста Лизы.\nВаш ранг поднялся до ${userData.range} ранга! Теперь у вас есть возможность завершить терапию :)`);

                    userData.user_stage = 'false';
                    userData.user_id = '';
                    userData.resources_stage = 'true';
                    userStorage.set(chatId, userData);




                } else{

                    bot.forwardMessage(userData.user_id, chatId, msg.message_id);


                }

            }


    /*---------------------------------------------------------------------QUESTIONS--RU-----------------------------------------------------------------------------------------------------*/
            else if (userData && userData.query == 'да' && userData.stage === 'wait_answer_1') {

                userData.answer_1 = msg.text;
                userData.stage = 'wait_answer_2';
                userStorage.set(chatId, userData);

                await bot.sendMessage(chatId, `2. Какие эмоции чаще всего вызывают у вас затруднения или вызывают негативные реакции?`, { reply_markup: { remove_keyboard: true }});

            } else if (userData && userData.query == 'да' && userData.stage === 'wait_answer_2') {

                userData.answer_2 = msg.text;
                userData.stage = 'wait_answer_3';
                userStorage.set(chatId, userData);

                bot.sendMessage(chatId, `3. Как вы обычно справляетесь с эмоциональным стрессом или напряжением?`);
                
            } else if (userData && userData.query == 'да' && userData.stage === 'wait_answer_3') {

                userData.answer_3 = msg.text;
                userData.stage = 'wait_answer_4';
                userStorage.set(chatId, userData);

                bot.sendMessage(chatId, `4. Какие методы или стратегии вы используете для самоуправления в эмоционально насыщенных ситуациях?\nМожете отправить свой вариант`, {
                    reply_markup: {
                        keyboard: [
                            ['Пытаюсь подавить эмоции'],
                            ['Фиксирую внимания на что нибудь другое'],
                            ['Скорее эмоции управляют мной чем я ими'],
                            ['Делаю глубокий вдох', 'Отстраняюсь и ухожу'],
                        ]
                    }
                });
                
            } else if (userData && userData.query == 'да' && userData.stage === 'wait_answer_4') {

                userData.answer_4 = msg.text;
                userData.stage = 'wait_answer_5';
                userStorage.set(chatId, userData);

                bot.sendMessage(chatId, `5. Чувствуете ли вы необходимость в развитии навыков эмоциональной осведомленности и саморегуляции?`, { reply_markup: { remove_keyboard: true }});
                
            } else if (userData && userData.query == 'да' && userData.stage === 'wait_answer_5') {

                userData.answer_5 = msg.text;
                userData.stage = 'wait_answer_6';
                userStorage.set(chatId, userData);

                bot.sendMessage(chatId, `6. Считаете ли вы, что ваша способность понимать и управлять эмоциями влияет на вашу профессиональную и личную жизнь?`);
                
            } else if (userData && userData.query == 'да' && userData.stage === 'wait_answer_6') {

                userData.answer_6 = msg.text;
                userData.stage = 'wait_answer_7';
                userStorage.set(chatId, userData);

                bot.sendMessage(chatId, `7. Есть ли у вас конкретные ситуации, в которых вы чувствуете, что требуется поддержка или помощь в области эмоционального благополучия?`);
                
            } else if (userData && userData.query == 'да' && userData.stage === 'wait_answer_7') {

                userData.answer_7 = msg.text;
                userData.stage = 'wait_answer_8';
                userStorage.set(chatId, userData);

                bot.sendMessage(chatId, `8. Какие виды психологической поддержки или помощи вам кажутся наиболее привлекательными или полезными?`, {
                    reply_markup: {
                        keyboard: [
                            ['Личная терапия', 'Самопомощь'],
                            ['Коллективные работы', 'Гештальт терапия'],
                            ['Когнитивно - поведенческая терапия']
                        ]
                    }
                });
                
            } else if (userData && userData.query == 'да' && userData.stage === 'wait_answer_8') {

                userData.answer_8 = msg.text;
                userData.stage = 'wait_answer_9';
                userStorage.set(chatId, userData);

                bot.sendMessage(chatId, `9. Считаете ли вы, что лучшая психологическая поддержка для вас – это групповые занятия, индивидуальные консультации или другие формы?`, { reply_markup: { remove_keyboard: true }});
                
            } else if (userData && userData.query == 'да' && userData.stage === 'wait_answer_9') {

                userData.answer_9 = msg.text;
                userData.stage = 'wait_answer_10';
                userStorage.set(chatId, userData);

                bot.sendMessage(chatId, `10. Какие конкретные цели вы хотели бы достичь в своем эмоциональном и психологическом благополучии в ближайшем будущем?`);
                
            } else if (userData && userData.query == 'да' && userData.stage === 'wait_answer_10') {

                userData.answer_10 =await  msg.text;
                await userData.range++;
                userData.stage =await  'ai_content';
                userData.answer_stage = 'true'
                userStorage.set(chatId, userData);

                bot.sendMessage(users.psych.id, `Это id пользователя ${chatId} 
1.${userStorage.get(chatId).answer_1}
2.${userStorage.get(chatId).answer_2}
3.${userStorage.get(chatId).answer_3}
4.${userStorage.get(chatId).answer_4}
5.${userStorage.get(chatId).answer_5}
6.${userStorage.get(chatId).answer_6}
7.${userStorage.get(chatId).answer_7}
8.${userStorage.get(chatId).answer_8}
9.${userStorage.get(chatId).answer_9}
10.${userStorage.get(chatId).answer_10}`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Отправить ресурсы',
                        callback_data: 'sendResourses'
                    }
                ], 
                [
                    {
                        text: 'Начать личную терапию',
                        callback_data: 'start_one_to_one'
                    }
                ]
            ]
        }
    });
                await bot.sendMessage(chatId, `Персональные данные бонусом. Чуть позже отправим их вам. Вам отправит персональный контент наш специалист Лиза.\nА пока вы можете задавать вопросы и поделитьбся своими проблемами и наш бот ответить вам`);

                if ( userData.community_stage === 'true' ) {
                    userData.range++
                    await bot.sendMessage(chatId, `Поздравляю вы получили ${userData.range} ранг.`);
                } else {
                    await bot.sendMessage(chatId, `Поздравляю вы получили ${userData.range} ранг. Теперь вы можете пользоваться чат терапией, для пользования нажмите /chat_therapy`);

                }

                await bot.sendVideo(chatId, './Доп материалы/IMG_5621.MOV');

            } else if ( userData && userData.query == 'да' && userData.stage === 'ai_content' ) {

                bot.sendMessage(chatId, await gpt_assistant(msg.text));

            } 


    /*---------------------------------------------------------------------QUESTIONS--KZ-----------------------------------------------------------------------------------------------------*/

            else if (userData && userData.query == 'ия' && userData.stage === 'wait_answer_1') {

                
                
                let answer_1 = msg.text;
                let answer = userData.answer;
                answer.push(answer_1);
                userData.answer = answer
                userData.stage = 'wait_answer_2';
                userStorage.set(chatId, userData);

                bot.sendMessage(chatId, `2. Сізге қандай эмоциялар жиі қиындық тудырады немесе жағымсыз реакциялар тудырады?`, {reply_markup: {remove_keyboard: true}});

            } else if (userData && userData.query == 'ия' && userData.stage === 'wait_answer_2') {

                // answer.push(msg.text);
                // console.log(answer)

                let answer_2 = msg.text;
                let answer = userData.answer;
                answer.push(answer_2);
                userData.answer = answer

                userData.stage = 'wait_answer_3';
                userStorage.set(chatId, userData);
                console.log(userStorage)


                bot.sendMessage(chatId, `3. Сіз әдетте эмоционалды стрессті немесе кернеулі күйді қалай жеңесіз?`);



                
            } else if (userData && userData.query == 'ия' && userData.stage === 'wait_answer_3') {

                // answer.push(msg.text);
                // console.log(answer)

                let answer_3 = msg.text;
                let answer = userData.answer;
                answer.push(answer_3);
                userData.answer = answer


                userData.stage = 'wait_answer_4';
                userStorage.set(chatId, userData);
                console.log(userData)


                bot.sendMessage(chatId, `4. Эмоционалды қарқынды жағдайларда өзіңізді басқару үшін қандай әдістерді немесе стратегияларды қолданасыз?`, {
                    reply_markup: {
                        keyboard: [
                            ['Эмоцияны басуға тырысу'],
                            ['Мен басқа нәрсеге назар аударамын'],
                            ['Эмоциялар мені олардан гөрі басқарады']
                            ['Мен терең дем аламын', 'Мен алыстаймын және кетемін'],
                        ]
                    }
                });
                
            } else if (userData && userData.query == 'ия' && userData.stage === 'wait_answer_4') {
                // answer.push(msg.text);
                // console.log(answer)

                let answer_4 = msg.text;
                let answer = userData.answer;
                answer.push(answer_4);
                userData.answer = answer;
                console.log(userData)

                userData.stage = 'wait_answer_5';
                userStorage.set(chatId, userData);
                console.log(userStorage)


                bot.sendMessage(chatId, `5. Сіз эмоцияңызды түсіну мен өзін-өзі реттеу дағдыларын дамыту қажеттілігін сезінесіз бе?`, {reply_markup: {remove_keyboard: true}});
                
            } else if (userData && userData.query == 'ия' && userData.stage === 'wait_answer_5') {
                userData.answer.push(msg.text);

                userData.answer_5 = msg.text;
                userData.stage = 'wait_answer_6';
                userStorage.set(chatId, userData);
                console.log(userStorage)


                bot.sendMessage(chatId, `6. Сіздің эмоцияларды түсіну және басқару қабілетіңіз сіздің кәсіби және жеке өміріңізге әсер етеді деп ойлайсыз ба?`);
                
            } else if (userData && userData.query == 'ия' && userData.stage === 'wait_answer_6') {
                userData.answer.push(msg.text);

                userData.answer_6 = msg.text;
                userData.stage = 'wait_answer_7';
                userStorage.set(chatId, userData);
                console.log(userStorage)


                bot.sendMessage(chatId, `7. Сізде эмоционалды әл-ауқат бойынша қолдау немесе көмек қажет деп санайтын нақты жағдайлар бар ма?`);
                
            } else if (userData && userData.query == 'ия' && userData.stage === 'wait_answer_7') {
                userData.answer.push(msg.text);

                userData.answer_7 = msg.text;
                userData.stage = 'wait_answer_8';
                userStorage.set(chatId, userData);
                console.log(userStorage)


                bot.sendMessage(chatId, `8. Сізге психологиялық қолдаудың немесе көмектің қандай түрлері ең тартымды немесе пайдалы болып көрінеді?`, {
                    reply_markup: {
                        keyboard: [
                            ['Жеке терапия', 'Өзіне-өзі көмектесу'],
                            ['Ұжымдық жұмыс', 'Гештальт терапиясы'],
                            ['Когнитивті мінез-құлық терапиясы']
                        ]
                    }
                });
                
            } else if (userData && userData.query == 'ия' && userData.stage === 'wait_answer_8') {
                userData.answer.push(msg.text);

                userData.answer_8 = msg.text;
                userData.stage = 'wait_answer_9';
                userStorage.set(chatId, userData);
                console.log(userStorage)


                bot.sendMessage(chatId, `9. Сіз үшін ең жақсы психологиялық қолдау топтық сабақтар, жеке кеңестер немесе басқаша формалар деп ойлайсыз ба?`, {reply_markup: {remove_keyboard: true}});
                
            } else if (userData && userData.query == 'ия' && userData.stage === 'wait_answer_9') {
                userData.answer.push(msg.text);

                userData.answer_9 = msg.text;
                userData.stage = 'wait_answer_10';
                userStorage.set(chatId, userData);
                console.log(userStorage)


                bot.sendMessage(chatId, `10. Сіз эмоционалды және писхологиялық әл-ауқат бойынша қандай нақты мақсаттарға қол жеткізгіңіз келеді?`);
                
            } else if (userData && userData.query == 'ия' && userData.stage === 'wait_answer_10') {
                userData.answer.push(msg.text);

                userData.answer_10 = await msg.text;
                userData.stage = await 'ai_content';
                userData.range += await 1;
                await userStorage.set(chatId, userData);

                bot.sendMessage(users.psych.id, `Это id пользователя ${chatId} 
1.${userStorage.get(chatId).answer_1}
2.${userStorage.get(chatId).answer_2}
3.${userStorage.get(chatId).answer_3}
4.${userStorage.get(chatId).answer_4}
5.${userStorage.get(chatId).answer_5}
6.${userStorage.get(chatId).answer_6}
7.${userStorage.get(chatId).answer_7}
8.${userStorage.get(chatId).answer_8}
9.${userStorage.get(chatId).answer_9}
10.${userStorage.get(chatId).answer_10}`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Отправить ресурсы',
                        callback_data: 'sendResourses'
                    }
                ], 
                // [
                //     {
                //         text: 'Начать личную терапию',
                //         callback_data: 'start_one_to_one'
                //     }
                // ]
            ]
        }
    });
                await bot.sendMessage(chatId, `Дербес деректер бонуспен. Біраз уақыттан кейін біз оларды сізге жібереміз. Сізге біздің маман Лиза жеке деректерді жібереді.\n Әзірге сіз сұрақтар қойып өз мәселелеріңізбен бөлісе аласыз және Біздің бот сізге жауап береді`);
                if ( userData.community_stage === 'true' ) {
                    userData.range++
                    await bot.sendMessage(chatId, `Құттықтаймын сіз ${userData.range} дәрежеге ие болдыңыз.`);
                } else {
                    await bot.sendMessage(chatId, `Құттықтаймын сіз ${userData.range} дәрежеге ие болдыңыз. Енді сіз чат терапиясын пайдалана аласыз, пайдалану үшін /chat_therapy түймесін басыңыз`);

                }            
                bot.sendVideo(chatId, './Доп материалы/IMG_5621.MOV');

            } else if ( userData && userData.query == 'ия' && userData.stage === 'ai_content' ) {

                bot.sendMessage(chatId, await gpt_assistant(msg.text));

            } else if ( userData && userData.chat_stage === 'ai_content' ) {

                bot.sendMessage(chatId, await gpt_assistant(msg.text));

            } 
        }
    catch(error) {

        console.log(error);
        

    }
});




/*---------------------------------------------------------------------CALLBACK-QUERY----------------------------------------------------------------------------------------------------*/

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userData = userStorage.get(chatId) || {};


    if ( query.data == 'русский' ) {
        userData.query = query.data;
        userStorage.set(chatId, userData);

        await bot.sendMessage(chatId, `Мы твой личный психологический помощник-друг.`);
        await bot.sendMessage(chatId, `Что может получить пользователь\nЗдесь ты можешь: обучиться эмоциональному интеллекту, выговориться, получить обратную связь, и это все абсолютно конфиденциально.`);
        await bot.sendMessage(chatId, `Как работает наш чат-бот:\nПервый шаг-это пройти тест, где ты сможешь увидеть свое состояние на данный момент. каждый день, ты будешь получать новое, обучающее видео по эмоциональному интеллекту, если ты хочешь рассказать о каком-то болезненном моменте, тебе следует перейти в чат-терапию. После 5 раз в день, ты будешь получать сообщение, которое будет узнавать о ваших эмоциях в определенный момент, эта практика, поможет тебе понимать свои чувства `)

        setTimeout( () => {
            bot.sendMessage(chatId, `Запускаем опрос?`, {
                reply_markup: {
                    inline_keyboard: [[{
                        text: 'Да!',
                        callback_data: 'да'
                    }]]
                }
            })
        }, 3000);
    } else if ( query.data == 'казахский' ) {
        userData.query = query.data;
        userStorage.set(chatId, userData);

        await bot.sendMessage(chatId, `Біз сіздің жеке психологиялық көмекшіңіз-досыңыз.`)
        await bot.sendMessage(chatId, `Мұнда сіз: эмоционалды интеллектті үйренесіз, көңіліңіздегіні айта аласыз, кері байланыс аласыз, эмоцияларды, дағдарыстарды, ауыр сәттерді экологиялық тұрғыдан қалай сезінуге болатыны туралы нұсқаулар аласыз және мұның бәрі құпия болып қалады.`);
        await bot.sendMessage(chatId, `Бұл чатөбот қалай жұмыс істейді?\nБірінші қадам-сіздің сол сәттегі жағдайыңызды көре алатын тестті тапсыру. Күн сайын сіз эмоционалды интеллект туралы үйрететін жаңа видео аласыз, содан кейін сіз қандай да бір ауыр сәт туралы сөйлескіңіз келсе, сіз чат терапиясына өтіп,  өз сезімдеріңіз туралы бөлісіп, кері байланыс аласыз , содан соң күні бойы, дәлірек айтқанда күніне 5 рет, сіздің сол уақыттағы эмоцияларыңыз туралы сұрайтын хабарлама келеді, бұл тәжірибе сіздің алдағы сезімдеріңізді анықтауға және жалпы сезімдеріңізді анықтауға көмектеседі.`);

        setTimeout( () => {
            bot.sendMessage(chatId, `Опросты бастаймыз ба?`, {
                reply_markup: {
                    inline_keyboard: [[{
                        text: 'Ия!',
                        callback_data: 'ия'
                    }]]
                }
            })
        }, 3000);
    } else if ( query.data == 'да' ) {
        userData.stage = 'wait_answer_1';
        userData.query = query.data;
        userStorage.set(chatId, userData);

        bot.sendMessage(chatId, `1. Как вы оцениваете свой текущий уровень эмоциональной устойчивости?`, {
            reply_markup: {
                keyboard: [
                    [ '1', '2', '3', '4'],
                    [ '5', '6', '7', '8'],
                    [ '9', '10']

                ]
            }
        });

    } else if ( query.data == 'ия' ) {
        userData.stage = 'wait_answer_1';
        userData.query = query.data;
        userStorage.set(chatId, userData);

        bot.sendMessage(chatId, `1. Сіз өзіңіздің қазіргі эмоционалды тұрақтылық деңгейіңізді қалай бағалайсыз?`, {
            reply_markup: {
                keyboard: [
                    [ '1', '2', '3', '4'],
                    [ '5', '6', '7', '8'],
                    [ '9', '10']

                ]
            }
        });

    } else if ( query.data == 'chat_therapy') {
        userData.chat_stage = 'ai_content';
        userStorage.set(chatId, userData);

        bot.sendMessage(chatId, `Здраствуйте, чем могу помочь? Задавайте свои вопросы`);

    }  else if ( query.data === 'sendResourses' ) {

        if ( chatId == users.psych.id ) {

            userData.psych_stage = 'wait_resources';
            userStorage.set(chatId, userData);

            bot.sendMessage(chatId, `Для отправки ресурсов напишите айди получателя, он должен быть на первой строке в ответах ползователя. Сначала отправьте его айди после чего все ваши сообщение отправяться ему ввиде сообщении от бота
ВАЖНО!!! Все сообщения!!!`);

        } else {
            bot.sendMessage(chatId, `У вас нет доступа`);
        }
    }  else if ( query.data === 'stop_send_all_resourses' ) {
        userData.all_resourses = 'false';
        userStorage.set(chatId, userData);
        bot.sendMessage(chatId, `Вы перестали отправлять всем ресурсы`)
    } else if ( query.data == 'end') {

    }
});


/*---------------------------------------------------------------------GPT-ASSISTANT-FUNCTION----------------------------------------------------------------------------------------------------*/

async function gpt_assistant(userInput) {
    const url = "https://api.openai.com/v1/chat/completions";
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
            role: "system",
            content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: userInput
        }
      ],
      temperature: 1,
      max_tokens: 1280,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    };
  
  
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + openApiKey,
      },
      body: JSON.stringify(payload)
    });
  
    const res = await response.json();
    console.log(res)
    const answer = res.choices[0].message["content"];
    console.log(answer)
    return answer;
  };

