import express from 'express';
import { prisma } from '../utils/prisma_client.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import UserToken from '../middleware/auth.middlewares.js'
import { Prisma } from '@prisma/client';



const router = express.Router();

//로그인
router.get('/login', async (req, res, next) => {
    try {
        const { name, password } = req.body;

        const user = await prisma.uSERS.findFirst({ where: { name: name } });

        if (!user)
            return res.status(401).json({ message: '존재하지 않는 이메일입니다.' });
        // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
        else if (!(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });


        const token = jwt.sign(
            {
                userId: user.UserId,
            },
            process.env.JSONWEBTOKEN_KEY,
        );

        res.cookie('authorization', `Bearer ${token}`);
        res.userId = user.UserId


        return res.status(200).json({ message: `${name} 님의 로그인에 성공했습니다.` });
    }
    catch {
        return res.status(404).json({ message: '로그인 실패' });
    }


});

//회원가입
router.post('/signup', async (req, res, next) => {
    try {
        const { name, password } = req.body;
        const isExistUser = await prisma.uSERS.findFirst({
            where: {
                name: name,
            },
        });

        if (isExistUser) {
            return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
        }

        if (password.length < 6) {
            return res.status(409).json({ message: '비밀번호가 6자리 미만입니다.' });
        }




        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await prisma.$transaction(async (tx) => {
            // Users 테이블에 사용자를 추가합니다.
            const user = await tx.users.create({
                data: {
                    name: name,
                    password: hashedPassword
                },
            });

            return [user];
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted
        }
        )



        return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
    }
    catch (err) {
        next(err);

    }
});


//유저 정보 조회
router.get('/users/:id', UserToken, async (req, res, next) => {
    try {
        const { USER_ID } = req.params;
        console.log(req.body);

        const users = await prisma.uSERS.findFirst({
            where: {
                USER_ID : USER_ID
            },
            select: {
                USER_ID : true,
                PASSWORD : false,
                GEM : true

            },
        });

        return res.status(200).json({ data: "읽기 성공" });
    }
    catch (err) {
        next(err);
    }

});

//유저 랭킹 조회
router.get('/rank', UserToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(req.body);





        const users = await prisma.uSERS.findMany({
            where: [
                {
                    SCORES: 'desc'
                }
            ],
            select: {
                NAME : true,
                SCORES: true

            },
            take: 10 //랭킹 10위까지만 가져오도록 하자.
        });

        return res.status(200).json({ data: users });
    }
    catch (err) {
        next(err);
    }

});

//타워 가챠
router.post('/tower/draw', async (req, res, next) => {
    try {

    }
    catch (err) {
        next(err);
    }
})

//타워 업그레이드
router.put('/tower/upgrade',UserToken, async (req, res, next) => {
    try {
        //변경할 타워를 받자.
        //const {towerID} = req.body;
        //재료도 받을 경우는 밑처럼
        const {towerID, ingredient} = req.body;

        const user = req.user;

        //강화를 할 때 재화로 업그레이드 하는 경우
        let successCount = Math.floor(Math.random()*100);

        //성공 확률을 해당 확률 안에 들어간다면 성공한다는 식

        if(successCount < 70)
        {
            await prisma.oWN_TOWERS.update({
                where : {
                    id : towerID
                },
                data : {
                    UPGRADE : {
                        increment : 1
                    }
                }
            })

            
        }
        else(successCount > 95)//파괴 확률로 하자
        {
            const deleted = await prisma.oWN_TOWERS.delete({
                where : {
                    id : towerID
                }
            })
        }

        //합성을 통해서 처리할 경우
        const transaction = await prisma.$transaction(async (tx)=>{
            //재료가 될 테이블을 찾는다.
            const ingred = await tx.oWN_TOWERS.findMany({
                where : {
                    USER_ID : user.USER_ID,
                    TOWER_ID : {
                        in : ingredient
                    }
                }
            })


        })

        await prisma.uSERS.update({
            where : {
                USER_ID : user.USER_ID
            },
            data : {
                GEM : {
                    decrement : 1000
                }
            }
        })





        
        

        //return res.status(202).json({towerID : 1, payload : {}})
    }
    catch (err) {
        next(err);
    }
})

//젬 획득
//현재 시점에선 1000을 추가하는 코드
router.put('/gem', UserToken, async (req, res, next) => {
    try {
        //usertoken을 통해 인증 하고  req에 들어 있는 user 정보를 불러온다.
        const user = req.user;
        await prisma.uSERS.update({
            where : {
                ID : user.ID
            },
            data : {
                GEM : {increment : 1000}
            }
        })
    }
    catch (err) {
        next(err);
    }
})