# Blast To The Past 2
Points: 250

## Category
OSINT

## Question
What are the past events of William A. Shine Great Neck South High School?

## Hints
>Where can you find more about our school other than the school website?
>
>The flag is in `gnsctf{FLAG}` format

## Analysis

It seems that everyone that solved Blast To The Past 1 solved Blast To the Past 2. This suggests that we did not provide enough hints for Blast To The Past 1 for people to understand what the challenges were looking for.

The challenge asks to find the past events of our school without visiting our school's website. Where else can we find information on our school? Wikipedia!

# Solution

If you visit our school's [Wikipedia page](https://en.wikipedia.org/wiki/William_A._Shine_Great_Neck_South_High_School) you can see that there is a section loosely dedicated to events featuring `Cultural Heritage` and `Blazing Trails-4-Autism`. Where's gnsCTF?

To view past revisions on the Wikipedia page, we can take advantage of the `View history` button that redirects to the page's [revision history](https://en.wikipedia.org/w/index.php?title=William_A._Shine_Great_Neck_South_High_School&action=history). If you look at the list, there is a revision by the user GNSCTF. To view what was changed under the revision, we can click on the `prev` button. The flag is hidden under the gnsCTF section.

### Flag
`gnsctf{h1dd3n_1n_pl41n_s1ght}`