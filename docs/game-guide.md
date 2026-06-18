Hero Stats and Skills
Base stats

    Atk - Physical attack. Is reduced by Def.
    Matk - Magical attack. Is reduced by Mdef.
    Acc - Accuracy, determines chance to hit the enemy. See Below
    Crit - Chance (in %) to score a critical hit. See Below
    Cdmg - Critical damage modifier. Increases Critical damage additively. Base Critical damage is 2x damage. Cdmg +20% equals 2.2x Critical damage.
    Hp - Hit points, amount of Health.
    Def - Physical defense, reduces incoming Atk damage.
    Mdef - Magical defense, reduces incoming Matk damage.
    Eva - Evasion. Used by enemies to evade hits. See Accuracy
    Ap - Ability points. Used to cast Skills. See Below
    Str - Strength increases Atk.
    Int - Intellect increases Matk.
    Dex - Dexterity increases Acc.
    Luck - per 1 luck gain 1.6% chance for lucky hit. Lucky hits deal 1.35x dmg.
        Str\Int\Dex scaling you can find on each Heroes' page: here.

Percent stats

    Atk %, Matk %, Acc %, Def %, Mdef %, Hp % Xp % and Cdmg % all stack additively, including a Hero Passive modifier like Might\Intellect. For example, Might Passive + 2 Radiant Prefixes gives 1.3x Atk bonus. A Hero with 20% Cdmg and 15% Cdmg would deal 2.35x Critical damage.

PLv Potions

    A non-Prestiged Hero can use 8 Enchantment Potions, a 1st Prestige Hero can use 12 and 2nd Prestige Hero can use 16.
        Prestiging removes all Enchantments. Reclassing does not.
    Regardless of a Hero's level when given the potion you will gain full benefits. The potions are retroactive.
        For example, a level 40 Hero will gain 4 points instantly, the Hero will then continue to gain 0.1 point each time they level up.
    Plv Potions give more stats than +X Potions.

Skills

The Skills page lists every skill in the game with a detailed explanation.

    At level 10 a Hero gains 5 Ap and unlocks Skills.
    Every 2 levels afterward they gain an additional Ability point.
    Heroes level 40 and higher have 20 Ap, which is the cap.
        Wisdom Passive, unique to Mages, Clerics, Dark Knight, and Bards raises the Ap cap by 2 for a total of 22.
        2 Prefixes: Savvy and Master's, add 1 and 2 Ap respectively.
    Each Hero has 7 unique Skills (except for Bard who has 8), unlocked at levels 10, 15, 20, 25, 30, 35, and 51.
    Skills that deal direct damage can Crit and miss.
    True Damage cannot Crit, but can Lucky Hit.
    Lesser Heal, Light's Grace and Greater Heal cannot Crit.
        Heals won't overheal your Hero, so you cannot heal more than the amount of HP a Hero had going into the fight.
    Mana Shield grants a shield equal to 0,6x of your hero's matk. Blocks only magical damage, physical and true damage will bypass it.
    Differently named buffs can stack. For example:
        Enrage and Vicious Strike gives 1.6x + 1.3x = 1.9x damage modifier.
            For example with 500 Atk using both Skills would boost Hero to 950 Atk. 950/500 = 1.9x.
            With 500 base Atk, Might passive and Radiant prefix Hero will have 2.1x modifier (all modifiers stacks additively)

Mage skills

    Silence cannot miss.
    Silence will not negate enemy Shields.
    Amplify Magic doubles the effects of all enemy's debuffs and deal 0.8x matk x number of debuffs. DoTs are classified as debuffs and their damage will be doubled. Will deal only 0.8x if there are no effects to amplify.

Warrior skills

    Taunt redirects all damage of a next enemy attack (so it does not need to be used right before the enemy attack) to a caster, debuffs, however, aren't taunted and will affect everyone who should be have hit by it. Reflect damage will also trigger the skill, even if it would have dealt 0 damage. Taunt is also considered as a debuff, and will cause Mage's Amplify Magic to deal more damage. The effect alone isn't strenghtened by any way.

    Block will only reduce Physical incoming damage by 78% before mitigations, the magical damage is unchanged.
        Any debuffs applied by the Attack will still be applied to the Hero.

Paladin skills

    Shield will only reduce Magical incoming damage by 78% before mitigations, the physical damage is unchanged.
    Holy Shield sets whole party's mdef equal to 1.3x paladin's mdef, making them to recieve the equal amount of damage. Physical damage is unchanged.
        Any debuffs applied by the Attack will still be applied to the team.

Rogue and Assassin skills

    Evade will reduce all incoming damage (including true damage) for the Hero that used it by 78% before mitigations.
        Any debuffs applied by the Attack will still be applied to the Hero.

Berserker skills

    True Damage part of Berserk Smash can Lucky Hit.


Basic Combat Mechanics
THE DAMAGE FORMULA

D a m a g e = 100 100 + E n e m y   D e f e n s e × ( H e r o   A t t a c k × S k i l l   M o d i f i e r ) {\displaystyle Damage={\frac {100}{100+Enemy~Defense}}\times (Hero~Attack\times Skill~Modifier)}
For example, if a Berserker has 500 Atk and an enemy has 200 Def, using a Slash (1.6x Atk)--
100/(100 + 200) = 0.33. The Hero will only be doing 33% of his damage, which in this case is 266.66 damage (↑ 267.) 100/(100 + 200)*(500*1.6)

    Physical and Magical damage is calculated separately and then added together.
    Atk is used with Def, and Matk is used with Mdef.

ACCURACY / HIT CHANCE

H i t   c h a n c e = 200 × A c c A c c + E v a {\displaystyle Hit~chance={\frac {200\times Acc}{Acc+Eva}}}
For example, if your Hero has 50 Acc and the enemy has 75 Eva, you will have an 80% chance to hit. (200*50)/(50+75)

The formula leads to the hit chance always being 100% if your accuracy is equal to the enemies' evasion. You need 250 Acc to 100% hit all enemies (in F2P).
Attack Order

Knowing who attacks first is crucial when planning Skill order. Your Heroes will always attack first unless fighting one of the Weekly bosses, they attack first. Regular Epic bosses and special map bosses do not attack first. Order Follows this pattern:
First
Second












Third
Fourth

	Enemy (Last)












Fifth
Sixth
Skill order

    Turn 1 = Skill 1
    Turn 2 = Skill 2
    Turn 3 = Skill 3
    Turn 4 = Skill 4
    Turn 5 = Skill 5

On Turn 1 all of your Heroes will use their first Skill followed by the Enemy. Turn 2 Skill 2 and so on. If the fight doesn't end after the 5th turn it will repeat the same actions starting at Skill 1. If the Fight doesn't end after 200 Turns, it will auto-complete and result in a failure with all of your Heroes dead.
Enemy Damage

When an enemy attacks, if the target for the attack is not specified the damage is split between the front row. If a monster's attack is to deal 1.8x Atk, with 2 heroes in front both will take 0.9x Atk, 3 heroes will take 0.6x Atk each.

3 examples of specified damage are:

    Ares' "Savage Charge" skill Deal 2.5x Atk to the Center Hero. (Only the Center front Hero takes damage, does nothing if there is no center hero)

    Antares' "Deadly Venom" Deal .7x Matk to the Back Row for 3 Turns (Back row Heroes take 0.7x Matk ea, damage will be redirected to front row if there are no Heroes in backline)

    Dragon Whelp's "Flame Breath" Deal 1.2x Atk & 1.2x Matk (AOE) (Area of Effect, all Heroes take 1.2x Atk & 1.2x Matk damage)

AOE Damage

When an enemy uses an Area of Effect attack it follows this pattern:
Fourth
First












Fifth
Second














Sixth
Third
DOT Damage

When an enemy uses a Damage Over Time attack it will add an effect to each Hero. This effect will activate when the Hero attacks and they will suffer damage afterward. This effect can be cleared with Cleanse.
True Damage

True Damage is a unique Skill of Assassins, Rogues, Dark Knight, Night Beast, Night Stalker, Fatalis and Desolation Wolf. True damage deals damage that is not dependent on enemy defenses.
Heroes

The 4 Hero True Damage Skills, Cheap Shot, Puncture, Twilight Strike and Berserk Smash deal only what the description says. For example, if a Rogue has 500 Atk and 500 Acc, using Cheap Shot 2 (1.4x Atk+Acc) will deal 1400 damage. The Enemy will take 1400 damage and not calculate for Defense values. Berserk Smash on Crit deals 3% of enemy's current health as True Damage.
Enemy

Night Beast & Night Stalker: Swift Strike

    Deal 1x Atk as True Dmg .
        Deals 75 Atk and 75 Matk regardless of defense values. (Cannot be blocked, can be partially mitigated through Evade and Song of Defense skills)

Fatalis: Dark Flame

    Deal .5x Matk as True Dmg & Def ↓50% (AOE).
        Deals 0.5x Matk as True Dmg. (AOE)

Desolation Wolf: Desolate Howl

    Atk & Eva ↑50% for 3 Turns Deal .2x Atk as True dmg AOE
        Buff part is casted before the attack, therefore AoE will be affected by the buff

Basic Game Mechanics
LUCK

Luck increases the chance for increased quantities of items to drop from quests. Luck value is equal to a direct percentage increase.

For slots 1 and 2, Luck increases the number of materials dropped. Every 10 Luck gives +1 guaranteed item drop, up to 5 materials cap. (Slots 1 and 2 only)

For slots 3 and 4, Luck increases the chance to receive a drop from this Slot for each item by % (multiplicatively, by amount equal to party's combined luck) For slots 3 and 4 the cap depends on the Quest. See each Quest page for the cap.

Per 1 Luck of combined party's amount, gain 1% more essence from maps. This has no cap.

All Heroes have 0 luck except for the Bard who has build-in Luck bonus of 10, and can extend it by another 5 via one of his passives.

Per 1 luck, gain 1.6% for lucky hit chance. Lucky hits deal 1.35x damage and work with True dmg.

Luck also increases chance for rare monster to spawn, by 4% per 1 luck. Max chance is 50%, including base chance.
CRITICAL HITS

Critical hits deal 2x Damage. Skills that deal direct damage can Crit. The Critical Strike Passive can increase critical damage (Cdmg%) by 35% (making it 2.35x Dmg). Fatal Stab skill attacks with an additional 100 Cdmg%, making it 3x Dmg. These two can stack, so a critical hit with the Fatal Stab Skill + Critical Strike passive will deal 3.35x Dmg.

With the Poem of Focus skill Heroes deal 4.75x Crit damage. (5.1x with Critical strike passive). Assassin's skill Fatal Stab deals 6.1x.

All weapons have an invisible Crit stat of 1 except daggers/knives which have 5.

    True Damage cannot crit.
    Lesser Heal, Greater Heal and Light's Grace cannot crit.
    Mana Shield cannot crit.

Speed Bonus

Quest timers have been given a flat time to finish. There are 3 factors that reduce quest time.

    Group Effectiveness: How many Turns it takes to finish the fight.
    Speed Stat: gained through gear and prefixes. It reduces the quest time by a direct % which is based on the stat or game modifier. In case of parties, all heroes' speed stat is considered and summed up.
    Game modes - Speedrun (4x) and Hard Mode (2x) reduce quest timers, while Legendary and Super Crafters (2x) increase it.
    Speed Boost: You can buy the recipe from the store. There are 3 variations of this Potion, 15%, 25%, and 50% Speed Stat and Speed Boost factors added up CANT reduce the Quest time over 75%
    Speed events Speed Humpday or Speed Weekend. Decrease timers by 50%.

Although Speed Stat and Speed Boost factors don't stack with each other, Speed event and multipler determined by gamemode stack with everything. For example, if a quest X without any modifiers takes 50min, on Speedrun mode while at Speed weekend while party has 75% speed combined, it gives x0.03125 [0.25(4x faster, from speedrun mode) * 0.25 (4x faster, from combined party's speed stat) * 0.5 (2x faster, from speed weekend)] timer multipler, and the quest will take only 1.5 min.

T i m e r = O r i g o n a l   T i m e × 1 − S p e e d 100 {\displaystyle Timer=Origonal~Time\times {\frac {1-Speed}{100}}}

So 50% Speed gives you x a 0.5 modifier. The more turns it takes to finish a quest means a lower grade and higher Quest timer.
Quest Timer

To calculate.

    Take the base time and multiply it by Grade Variable.
        (S - 0.75, A - 0.9, B = 1, C = 1.1, D = 1.25)
    For each action add +5 seconds. For each turn passed add another 5 seconds.
    Reduce final value if your heroes have Speed stat.
        Time = time x (1 - speed)

For example, a Moss Golem has a 12 second base time. With S Grade you get 9 seconds. (12*0.75) Add 10 seconds for 1 turn and 1 action. (assuming your hero one-shot the mob) Final time is 19 seconds for the Quest. With 8% speed (19*0.92) = ~17 second Quest Time.
Prefix

This section is transcluded from Prefix. To change it, please edit the transcluded page.

All Weapons and Armor in the game have a chance for rolling a Prefix when crafting or buying. Adding a Prefix to a weapon also increases the Rarity of the item. Once you have unlocked the Enchanter you can use them to try and add or reroll Prefix.

All Prefixes are weighted, with most being 5 10 or 20. Fortunate prefix has a weight of 10 and with the total weight of all Prefixes being 710, there is a ~1% (10/710) chance to roll it. Eventually, weaker prefixes become unavaliable as your crafter/enchanter levels up, item's grade is also partially taken into the factor. For example, 60lvl Enchanter enchanting 60lvl item at S grade or 60lvl crafter crafting Oni's Decapitator (40lvl) at S rank, they can only roll the following prefixes: Radiant, Frigid, Strong, Rigid, Brisk, Master's, Swift, Fortunate, Expert's. Total weight of these prefixes is at 107, that means chance for rolling a satisfactory % prefix is at 9.3%, and rolling Master's at 1.8%.
Prefixes[1]

    data.PrefixData.lu

Crafting

In order to get a certain Prefix during the craft

( C r a f t e r   L v l ) + ( G r a d e × 2 ) − 4 ≥ ( E n c h a n t e r   L v l   R e q ) {\displaystyle (Crafter~Lvl)+(Grade\times 2)-4\geq (Enchanter~Lvl~Req)}

    EnchanterLvlReq is found in the table above.

Chance to roll a prefix on craft

C h a n c e = (   ( C r a f t e r   L v l ) + ( G r a d e × 2 ) − 4 − ( I t e m   L v l )   ) × 2 {\displaystyle Chance=(~(Crafter~Lvl)+(Grade\times 2)-4-(Item~Lvl)~)\times 2}

    Cap is 25%

Example

An A Grade Demon Axe with level 50 Blacksmith trying to gain a Radiant Prefix:

(   ( 50 ) + ( 4 × 2 ) − 4 − ( 46 )   ) × 2 = 16 %   C h a n c e   T o   R o l l   A   P r e f i x {\displaystyle (~(50)+(4\times 2)-4-(46)~)\times 2=16\%~Chance~To~Roll~A~Prefix} ( 50 ) + ( 4 × 2 ) − 4 ≥ ( 61 ) = F a l s e   ( 54 ≱ 61 ) {\displaystyle (50)+(4\times 2)-4\geq (61)=False~(54\ngeq 61)}

In this example, The item has a 16% chance to roll any Prefix. The item, however, does not meet the requirement to roll a Radiant Prefix as noted by False above. (54 was not greater than or equal to 61)
Suffix

This section is transcluded from Suffix. To change it, please edit the transcluded page.

All Weapons and Armor in the game have a chance for rolling a Suffix when crafting or buying. A higher Suffix increases an items stats and selling value. Suffixes range from none to +12. Adding a Suffix to a weapon also increases the Rarity of the item. Once you have unlocked the Enchanter you can use them to try and increase Suffix by 1. Doing so also has a chance to critically fail and decrease the Suffix by 1 from the item being enchanted.

All Suffixes are weighted. If a Suffix has a weight of 10 and with the total weight of all Suffixes being 144, there will be a ~6% (10/144) chance to get the specific Suffix on craft. Eventually, weaker suffixes become unavaliable to roll as your crafters level up. Currently, maximum suffix avaliable to roll by crafting is +11.
Suffix Modifiers[1]

    data.SuffixData.Lu

Crafting

Chance to roll a Suffix on Craft

( G r a d e × 2 ) − 4 + ( C r a f t e r   L e v e l − I t e m   L e v e l ) × 2 {\displaystyle (Grade\times 2)-4+(Crafter~Level-Item~Level)\times 2}

Suffix.MinLvl (From the table above)

( G r a d e × 2 ) − 4 + ( C r a f t e r   L e v e l ) {\displaystyle (Grade\times 2)-4+(Crafter~Level)}
Example

An A Grade Demon Axe with level 50 Blacksmith:

( 4 × 2 ) − 4 + ( 50 − 46 ) × 2 = 16 %   C h a n c e   T o   R o l l   A   S u f f i x {\displaystyle (4\times 2)-4+(50-46)\times 2=16\%~Chance~To~Roll~A~Suffix} ( 4 × 2 ) − 4 + ( 50 ) = 54   ( S u f f i x . M i n L v l ) {\displaystyle (4\times 2)-4+(50)=54~(Suffix.MinLvl)}

In this example Suffix.MinLvl was 54, looking at the table above, this met the requirements to roll up to +7 (51) but did not meet the requirements for +8 (56) Therefore the highest possible Suffix on Craft for this example item is +7 and there is a 16% chance to roll for Suffix.
Heroes
Heroes-all
All





There are 4 types of Heroes: Tanks, Damage Dealers, Healers, and Support.
Tanks

There are two types of tanks, traditional and non-traditional.

Traditional tanks are designed to absorb damage. They gain better scaling of Def and Mdef and have increased health. They include Warriors and Paladins.

Non Traditional Tanks are designed to negate damage rather than take it. They include Rogues and Assassins. This is accomplished through the skill Evade. In late game Clerics, Paladins and Dark Knights can also act as tanks with the ability to self-heal.

    Evade decreases all damage taken by 78% before mitigations, however, it does not negate any debuffs from the attack.

Damage Dealers

There are 3 types of Damages, Physical, Magical, and True Damage. Physical Damage benefits from Str bonuses and results in high Atk damage. The primary physical fighter is the Berserker.

Magical damage benefits from INT bonuses and results in high Matk damage. The primary magical fighter is the Mage.

True damage deals damage that is not dependant on Def and Mdef values. The three True damage fighters are the Assassin, Rogue and Dark Knight.

The Dark Knight is also a hybrid physical-magical damage dealer. They gain an equal bonus to Str and Int, however, magical damage building is more beneficial later on.
Healers

There are 3 Heroes who can heal, Cleric, Paladin and Dark Knight. The Paladin can deal damage and heal themselves in the process. He also has ability to heal the whole party that uses MAtk and MDef as coefficients. The Cleric has 2 healing skills, one for the whole team and one for the Hero in front of them. They also have a Skill that can Revive a fallen Hero. Dark Knight can heal themselves through the lifesteal from skills Unholy Slash and Unholy Slash II, depending how many damage they deal. It is possible to heal more than the amount of Hp a Hero had at the start of the battle, but if they finish with such a value it will not be updated. For example, if Hero X stars a battle with 500/1000 HP while battle they can be healed to 1000 HP, but when the fight is over and the Hero still has 1000 HP, this value won't overwrite the amount they had before the fight, so it will stay at 500. It was made to prevent players from sending heroes with sustain on a weak quest, and healing themselves before finishing the quest, effectively avoiding using Health potions.
Support

There are 2 support Heroes currently available, the Bard and Paladin. The Bard can buff the Atk&matk of the team, Atk&Matk&acc of a singular hero, along with increasing Crit damage and other various boosts or debuffs. Paladin can constantly increase Atk&Mdef of his party, along with massive Mdef boost for singular turn, constant Heal over Time as well as ability to cleanse debuffs from all of his group allies.
Hero Cost
Hero cost Hero 	Gold 	Hero 	Gold 	Hero 	Gold
1st 	10 	7th 	16,000 	13th[1] 	$0.99 USD
2nd 	500 	8th 	32,000 	14th[2] 	$0.99 USD
3rd 	1,000 	9th 	64,000 	15th[3] 	$0.99 USD
4th 	2,000 	10th 	128,000 	16th 	???
5th 	4,000 	11th[4] 	150,000 	17th 	???
6th 	8,000 	12th[5] 	200,000 	18th 	???

    Requires Optional In App Purchase
    Requires Optional In App Purchase
    Requires Optional In App Purchase
    Requires Merchant: The Frozen Tome DLC
    Requires Merchant: The Frozen Tome DLC

Hero Reclass

You can reclass any Hero to another as long as you have met the requirements for that Hero, by clicking the button on the top left of the Hero overlay screen. This costs 2,000 gold X # of Heroes.
Prestiging

Once a Hero reaches level 40 they have the option of Prestiging. This costs 10,000 Gold and will reset their level to 1. Upon ascending, their gear stays on them and will provide no stats until level requirements are met again. This hero will now get 50% more stats per level and increase their Stat scaling. The XP to level up increases. It is possible to Ascend while on a Quest. This will not affect the Quest outcome, and your Hero will only come out at level 2 regardless of XP gained.

    After Prestiging and reaching level 50 a Hero can Prestige again. This costs 50000 gold. The Hero has then extended level cap to 60, and will unlock an unique skill upon reaching level 51. This requires the Frozen Tome expansion.

    A Prestige 1 Hero can undergo Quests 2 levels earlier than a non-Prestiged Hero.
        A Prestige 2 Hero can undergo Quests 2 levels earlier than a Prestige 1 Hero and 4 levels earlier than a non-Prestiged Hero.

Reviving

The cost to revive a Hero is equal to 10 Gold X Hero level X 2 (if at P1) or X 3 (if at P2), altenatively Hero can be revived for free upon watching an ad (requires Internet connection)
Unlocks
Crafters

There are 3 Crafters that can be unlocked.
Jeweler

This section is transcluded from Jeweler. To change it, please edit the transcluded page.

Unlocked after any of your default Crafters (Blacksmith, Armorsmith, Woodworker, Clothworker, or Alchemist) is leveled to 15, they cost 15,000 coins to unlock. This crafter turns Crystals into Gems and creates jewelry such as earrings, necklaces, medallions, and trinkets.
Enchanter

This section is transcluded from Enchanter. To change it, please edit the transcluded page.

The Enchanter is a Crafter who is unlocked after purchasing the Jeweler and leveling any crafter to 25, they cost 60,000 coins to unlock. They turn Gems into Runes and use Crystals, Gems, and Runes to modify the stats of weapons, armor, and trinkets.

Don't unlock till the very end, after getting 10 Heroes to level 50 P1 and stock up on all Crystals and Runes. This is a massive money sink - ~750k coins needed to raise to level 50 (might be a little less with XP events).

Gear Enhancement There is no reachable limit on how many times you can re-enchant gear. The only limit is you providing the materials and coin. For example, you can re-enchant the same item over 30,000 times, provided you can afford the materials and costs. Successfully Enchanting for Suffix or Prefix will also re-roll the items Stats.

Improve Stats Re-rolls current item stats of weapons, armor, and trinkets using Crystals. This can also be used to improve item's Grade. The item can first go to a lower Grade before advancing higher. The first re-roll will cost 1 Tier appropriate Crystal and coins.

Xp The amount of Xp awarded for re-rolling stats is:

X p = I t e m   L e v e l × 5 {\displaystyle Xp=Item~Level\times 5}

Gold cost The amount of Gold it costs to re-roll stats is:

G o l d = ( I t e m   L e v e l × 20 ) + ( E n c h a n t   A t t e m p t × 20 ) {\displaystyle Gold=(Item~Level\times 20)+(Enchant~Attempt\times 20)}

Pattern

    With a B grade item, if the Enchanter's level is the same as enchanted item's level, it will follow this pattern of Grades: B -> C -> C-> B -> B -> B -> A -> A -> S.
        See below for formula.
    The Crystal cost pattern follows: 1 -> 2 -> 2 -> 3 -> 4 -> 6. Every additional attempt will cost 6 Crystals.

Prefix Enchant Re-roll or attempt to add a Prefix to weapons, armor, and trinkets using Gems. A success will also re-roll the items stats. The first attempt will cost 1 Tier appropriate Gem and have a varied success rate. After every attempt regardless of the result, the % chance of critical failure increases by 4%. If this option is rolled the item will have its Prefix removed.
Prefixes

Xp The amount of Xp awarded for rolling for Prefix is:

X p = I t e m   L e v e l × 10 {\displaystyle Xp=Item~Level\times 10}

Formula

P r e f i x   C h a n c e = ( 2 × ( E n c h a n t e r   L e v e l − I t e m   L e v e l ) ) + ( G r a d e × 2 ) {\displaystyle Prefix~Chance=(2\times (Enchanter~Level-Item~Level))+(Grade\times 2)}
If an Item has a Prefix add an extra 15 if none add 0.

In order to Enchant a certain Prefix The following equation must equal the Prefixes required level from the table above.

E n c h a t e r L v l R e q = ( E n c h a n t e r L e v e l ) + 5 + ( G r a d e × 2 ) {\displaystyle EnchaterLvlReq=(EnchanterLevel)+5+(Grade\times 2)}

Gold cost The amount of Gold for rolling for Prefix is:

Without Prefix

G o l d = ( I t e m   L e v e l × 40 ) {\displaystyle Gold=(Item~Level\times 40)}

With Prefix

G o l d = max {   ( I t e m   L e v e l × 40 ) − ( P r e f i x   M i n   L e v e l × 10 )   } , {   ( I t e m   L e v e l × 20 )   } {\displaystyle Gold=\max\{~(Item~Level\times 40)-(Prefix~Min~Level\times 10)~\},\{~(Item~Level\times 20)~\}}

Pattern The pattern of Gem cost follows: 1 -> 2 -> 2 -> 3 -> 4 -> 6.

Suffix Enchant Attempt to add or increase an Item's Suffix for weapons, armor using Runes. A success will also re-roll the items stats. The first attempt will cost 1 Tier appropriate Rune and have an 95% success rate. After every attempt regardless of the result, the % chance of critical failure increases by 4%. The more an item is enchanted for Suffix, the chance to lose (and upgrade) Suffix increases. If this option is rolled the item will have its Suffix decreased by 1.

Xp The amount of Xp awarded for rolling for Suffix is:

X p = I t e m   L e v e l × 10 {\displaystyle Xp=Item~Level\times 10}

Gold cost The amount of Gold for rolling for Prefix is:

Without Suffix

G o l d = ( I t e m   L e v e l × 60 ) {\displaystyle Gold=(Item~Level\times 60)}

With Suffix

G o l d = ( I t e m   L e v e l × 60 ) + ( S u f f i x m i n L e v e l × 20 ) {\displaystyle Gold=(Item~Level\times 60)+(SuffixminLevel\times 20)}

Pattern The pattern of Rune cost follows: 1 -> 2 -> 2 -> 3 -> 4 -> 6 -> 9.
Scribe

Upon buying Merchant: The Scribe Expansion , player gains access to Scribe, who can craft maps as well as scrolls providing one-time benefit on them. Maps are source of essence, which is essential in order to craft prestiged equipments that provide more both base and secondary stats. In addition to buying the proper expansion, player must have at least one crafter at 40 or more level in order to have Scribe unlocked.
Heroes

There are 2 hidden Heroes that can be unlocked and 1 that is unlocked through DLC.

    Paladin - Unlocked when you have both a level 30 Warrior and level 15 Cleric in your roster.

    Dark Knight - Unlocked when you have both a level 30 Mage and level 15 Berserker in your roster.

    Bard - Unlocked after purchasing Merchant: The Frozen Tome.

Inventory, Sell Slots and Customers
Inventory

You start with 16 Slots and can purchase 80 more for a total of 96 Slots. It costs 537,400 coins to purchase every Inventory Slot. With In App Purchases you can purchase an additional 64 Slots. This brings the total number of Inventory Slots to 160. After purchasing the Frozen Tome expansion you are given an additional 16 Inventory Slots for free. Another 16 Slots are then available for purchase. By buying the Scribe expansion, you get another 16 for free and 16 to buy. This brings the total number of Inventory Slots to 224.
Selling Slots

You start with 4 Slots and can purchase 8 more for a total of 12 Slots. It costs 12750 coins to purchase every Selling Slot.
Customers

After unlocking the 2nd Hero, Customers appear. The number of customers available is equal to the number of heroes unlocked + 2 (Max of 12 Customers).
DLC
Merchant: The Frozen Tome

The first DLC expansion costs $2.99 USD and includes the following:

    A new Hero class: Bard. Icn Bard
    A new Prestige level. Icn Warrior P2
    Each Hero unlocks a new Skill at level 51.
    Crafter, Customer and Hero level cap raised to 60.
    A new Region (level 51- 60) added.
    New Weapons, Armor, Trinkets and Potions!
    A new Rarity level (Relic.)
    Rare versions of the new monsters.
    2 more purchasable with gold Hero Slots added.
    16 free Inventory slots (16 more can be purchased for 32 total.)

Merchant: The Scribe Expansion

The second DLC expansion costs $3.99 USD and includes the following:

    A new Crafter: Scribe.
    You can now prestige crafters.
    You can now prestige items.
    A whole new batch of bosses to deal with.
    2 more purchasable with gold Hero Slots added.

Interface

The Home Screen has eight interactable buttons and 1 interactable area. Only 7 buttons are available by default. The Store (2) is unlocked after purchasing the second Hero. If you have previously purchased anything from the Store and have switched devices, there is now a Restore Purchases" option under Settings. (3)
Main Menu
Screenshot 20180221-100037

    1 - Theme. Customize Merchant Skin and Shop Theme.
    2 - Store. Open the Store or redeem a Reward Token.
    3 - Options. Change the game settings and other features.
    4 - Social. Social Media links.
    5 - Total amount of Gold.
    6 - Notifications.
    7 - Crafters. Opens Crafter menu.
    8 - Stock. Opens Inventory menu.
    9 - Shop. Opens Selling menu.
    10 - Hero. Opens Hero menu.
    11 - Daily Orders. Shows available Daily Orders.

Crafters

There are 3 options found under this menu.
CraftGuide

Clicking the Crafters' icon (left) shows available recipes. Clicking the arrow (right) shows Items you can craft with available resources.
Recipes you have unlocked
Recipes you have unlocked
Items you can craft with available resources
Items you can craft with available resources
Stock

This section is transcluded from Stock. To change it, please edit the transcluded page.

All Items your Heroes collect and Crafters craft are displayed here. You start with 16 Slots and can purchase 80 more for a total of 96 Slots. It costs 537,400 coins to purchase every Inventory Slot. With In App Purchases you can purchase an additional 64 Slots for $0.99 USD for 16 at a time. This brings the total number of Inventory Slots to 160. You are given two of each Tier 1 base Material to start the game.
Icon-mdpi	The following is based on The Frozen Tome Expansion and contains spoilers.

After purchasing the Frozen Tome expansion you are given an additional 16 Inventory Slots for free. Another 16 Slots are then available for purchase. It costs 440000 coins to purchase every additional Inventory Slot. This brings the total number of Inventory Slots to 192.
Icon-mdpi	End of information based on The Frozen Tome Expansion.

Items are sorted, by default, by ID and displayed Potions first followed by Equipment and finally Materials. You can now sort the Inventory by Type, Value, Level, or Rarity. There is no reachable limit to how high a stack of items can go. Pressing and holding a stack will display the number of Materials of each Grade.
Shop

This section is transcluded from Shop. To change it, please edit the transcluded page.

You start with 4 Slots and can purchase 8 more for a total of 12 Slots. It costs 12,750 coins to purchase every Selling Slot. When an Item has sold the icon will change to an envelope with an exclamation point. To cancel a sale press and hold on the item. At the bottom are four Slots for visiting Customers. There can be more than four at a time but only four will be displayed at a time.
Hero
IMG 0264

    1 - Share. Generates a screenshot to showcase Gear. (See directly Below)

Screenshot

    2 - Hero options.
        Change Hero Class
            It won't affect gear, level, or enchantments. Remember to manually reset your enchants and apply those corresponding to the Class change if needed. It will cost 2000 gold X # of Heroes owned each. You must meet the requirements for the unlocking the Hero you are trying to change too. This will also change the name back to default. Passive will be reset as well in order to avoid abuses such as giving an access to Wisdom passive for classes like Rogue/Assassin/etc..
        Reset Enchants.
            This will delete all of your enchantments.
        Change Name
            Can be either randomly generated or a custom input.
    3 - Prestige/Ascend Hero.
        Upon reaching level 40 you can Prestige your hero, taking it back to level 1 and resetting their enchants.
    4 - Skills. Available after level 10. This button is disabled while on a Quest.
    5 - Potions. Healing, Boost, and Enchantments Potions can be applied by clicking here. This button is disabled while on a Quest.

FAQ

Don't know where to put these in yet.
Crafting

    Material Grade effects crafted Grade.
        c l a m p ( r o u n d ( 1 + ( c r a f t e r   l e v e l − i t e m   l e v e l ) / 4 , 2 ) , 1 , 4.5 ) + s u m ( m a t   g r a d e + 0.25 ) / m a t c o u n t {\displaystyle clamp(round(1+(crafter~level-item~level)/4,2),1,4.5)+sum(mat~grade+0.25)/matcount}
        Divide by 2
        Round
        If you get 5 it is S rank
    Enchantments, Prefix, and Suffix do not carry over when using a piece of equipment as a Material.

Early Quests

    A Prestige 1 Hero can undergo Quests 2 levels earlier than a non-Prestiged Hero.
    A Prestige 2 Hero can undergo Quests 2 levels earlier than a Prestige 1 Hero and 4 levels earlier than a non-Prestiged Hero.

Max Stack

    99,999,999,999,999