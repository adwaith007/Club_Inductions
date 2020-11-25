#!/bin/bash
cd /home/
for((VAR=1; VAR <= 20; VAR++))
do
	cd student${VAR}
	((VAR1=${TOTAL}+1));
	find /home/prof1/Teaching_Material/ -type f -name "*" | sort -R| tail -5 | while read file;
	do
		cp $file ./prof1_work/hw${VAR1}.txt
		((VAR=${VAR}+1))
	done
	((VAR1=${TOTAL}+1));
	find /home/prof2/Teaching_Material/ -type f -name "*" | sort -R| tail -5 | while read file;
	do
		cp $file ./prof2_work/hw${VAR1}.txt
		((VAR=${VAR}+1))
	done
 	cd ..
done

((TOTAL=${TOTAL}+5))

