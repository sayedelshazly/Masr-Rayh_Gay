<?php

/*
 * Arabic validation messages. The site's primary UI language is Arabic,
 * so server-side errors must arrive in Arabic with the same field names
 * the traveller sees in the form (see `attributes` below).
 */

return [
    'accepted' => 'يجب قبول :attribute.',
    'array' => 'يجب أن يكون :attribute قائمة.',
    'boolean' => 'يجب أن تكون قيمة :attribute صحيحة أو خاطئة.',
    'confirmed' => 'تأكيد :attribute غير مطابق.',
    'current_password' => 'كلمة المرور غير صحيحة.',
    'date' => 'يجب أن يكون :attribute تاريخًا صحيحًا.',
    'after_or_equal' => 'يجب أن يكون :attribute تاريخًا اليوم أو بعده.',
    'email' => 'يجب أن يكون :attribute بريدًا إلكترونيًا صحيحًا.',
    'exists' => 'قيمة :attribute المختارة غير صحيحة.',
    'image' => 'يجب أن يكون :attribute صورة.',
    'in' => 'قيمة :attribute المختارة غير صحيحة.',
    'integer' => 'يجب أن يكون :attribute رقمًا صحيحًا.',
    'mimes' => 'يجب أن يكون :attribute ملفًا من نوع: :values.',
    'numeric' => 'يجب أن يكون :attribute رقمًا.',
    'required' => 'حقل :attribute مطلوب.',
    'required_without' => 'حقل :attribute مطلوب عندما لا يكون :values موجودًا.',
    'string' => 'يجب أن يكون :attribute نصًا.',
    'unique' => 'قيمة :attribute مستخدمة بالفعل.',

    'max' => [
        'array' => 'يجب ألا يحتوي :attribute على أكثر من :max عنصر.',
        'file' => 'يجب ألا يزيد حجم :attribute عن :max كيلوبايت.',
        'numeric' => 'يجب ألا تزيد قيمة :attribute عن :max.',
        'string' => 'يجب ألا يزيد :attribute عن :max حرفًا.',
    ],
    'min' => [
        'array' => 'يجب أن يحتوي :attribute على :min عنصر على الأقل.',
        'file' => 'يجب ألا يقل حجم :attribute عن :min كيلوبايت.',
        'numeric' => 'يجب ألا تقل قيمة :attribute عن :min.',
        'string' => 'يجب ألا يقل :attribute عن :min حرفًا.',
    ],

    'password' => [
        'letters' => 'يجب أن تحتوي كلمة المرور على حرف واحد على الأقل.',
        'mixed' => 'يجب أن تحتوي كلمة المرور على حرف كبير وحرف صغير على الأقل.',
        'numbers' => 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل.',
        'symbols' => 'يجب أن تحتوي كلمة المرور على رمز واحد على الأقل.',
        'uncompromised' => 'كلمة المرور دي ظهرت في تسريبات بيانات سابقة — اختر كلمة مرور تانية.',
    ],

    'attributes' => [
        // Booking checkout
        'customer_name' => 'الاسم',
        'customer_email' => 'البريد الإلكتروني',
        'customer_phone' => 'رقم الموبايل',
        'travel_date' => 'تاريخ السفر',
        'departure_id' => 'موعد الرحلة',
        'adults' => 'عدد الكبار',
        'children' => 'عدد الأطفال',
        'notes' => 'الملاحظات',
        // Account + reviews + gallery
        'name' => 'الاسم',
        'email' => 'البريد الإلكتروني',
        'password' => 'كلمة المرور',
        'rating' => 'التقييم',
        'body' => 'نص التقييم',
        'photo' => 'الصورة',
        'caption' => 'التعليق',
        // Design-your-trip
        'destinations' => 'الوجهات',
        'start_date' => 'تاريخ البداية',
        'days' => 'عدد الأيام',
        'budget' => 'الميزانية',
        'interests' => 'الاهتمامات',
        // Film request + admin
        'package' => 'الباقة',
        'tour_id' => 'الرحلة',
        'phone' => 'رقم الموبايل',
        'status' => 'الحالة',
    ],
];
